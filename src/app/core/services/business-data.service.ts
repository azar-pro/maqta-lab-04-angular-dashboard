import { Injectable, computed, inject, signal } from '@angular/core';
import { Customer, InventoryItem, NotificationItem, Project, ProjectStatus, TaskItem, Priority } from '../models/business.models';
import { MockBusinessRepository } from './mock-business.repository';

export type WorkspaceLoadState = 'idle' | 'loading' | 'ready' | 'error';

@Injectable({ providedIn: 'root' })
export class BusinessDataService {
  private readonly repository = inject(MockBusinessRepository);
  private readonly projectStore = signal<Project[]>([]);
  private readonly customerStore = signal<Customer[]>([]);
  private readonly inventoryStore = signal<InventoryItem[]>([]);
  private readonly taskStore = signal<TaskItem[]>([]);
  private readonly notificationStore = signal<NotificationItem[]>([]);
  private readonly customerNoteStore = signal<Record<string, { id: string; text: string; createdAt: string }[]>>({});
  private readonly stateStore = signal<WorkspaceLoadState>('idle');
  private readonly errorStore = signal<string | null>(null);

  readonly projects = this.projectStore.asReadonly();
  readonly customers = this.customerStore.asReadonly();
  readonly inventory = this.inventoryStore.asReadonly();
  readonly tasks = this.taskStore.asReadonly();
  readonly notifications = this.notificationStore.asReadonly();
  readonly customerNotes = this.customerNoteStore.asReadonly();
  readonly loadState = this.stateStore.asReadonly();
  readonly errorMessage = this.errorStore.asReadonly();
  readonly isLoading = computed(() => this.stateStore() === 'loading');
  readonly hasError = computed(() => this.stateStore() === 'error');

  readonly unreadNotifications = computed(() => this.notificationStore().filter(n => n.unread).length);
  readonly activeProjects = computed(() => this.projectStore().filter(p => p.status !== 'Completed').length);
  readonly pipelineValue = computed(() => this.projectStore().filter(p => p.status !== 'Completed').reduce((sum, p) => sum + p.value, 0));
  readonly lowStockCount = computed(() => this.inventoryStore().filter(i => i.status === 'Low stock' || i.status === 'Out of stock').length);

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.stateStore.set('loading');
    this.errorStore.set(null);
    try {
      const snapshot = await this.repository.loadSnapshot();
      this.projectStore.set(snapshot.projects);
      this.customerStore.set(snapshot.customers);
      this.inventoryStore.set(snapshot.inventory);
      this.taskStore.set(snapshot.tasks);
      this.notificationStore.set(snapshot.notifications);
      this.stateStore.set('ready');
    } catch (error) {
      this.errorStore.set(error instanceof Error ? error.message : 'Workspace data could not be loaded.');
      this.stateStore.set('error');
    }
  }

  retry(): void {
    void this.load();
  }

  simulateNextLoadFailure(): void {
    this.repository.failNextRequest();
    void this.load();
  }

  projectById(id: string) { return this.projectStore().find(project => project.id === id); }
  customerById(id: string) { return this.customerStore().find(customer => customer.id === id); }

  createProject(input: { name: string; clientId: string; status: ProjectStatus; dueIso: string; value: number; owner: string; scope: string; }): Project {
    const customer = this.customerById(input.clientId);
    if (!customer) throw new Error('Choose a valid customer.');
    const nextNumber = Math.max(0, ...this.projectStore().map(project => Number(project.id.replace(/\D/g, '')) || 0)) + 1;
    const project: Project = {
      id: `RV-${String(nextNumber).padStart(3, '0')}`,
      name: input.name.trim(), clientId: customer.id, client: customer.name, status: input.status,
      due: this.formatDate(input.dueIso), dueIso: input.dueIso, value: input.value, progress: 0,
      owner: input.owner.trim(), scope: input.scope.trim()
    };
    this.projectStore.update(items => [project, ...items]);
    if (project.status !== 'Completed') {
      this.customerStore.update(items => items.map(item => item.id === customer.id ? { ...item, activeProjects: item.activeProjects + 1, lastActivity: 'Just now' } : item));
    }
    return project;
  }

  updateProject(id: string, input: { name: string; status: ProjectStatus; dueIso: string; value: number; progress: number; owner: string; scope: string; risk: string; }): Project | undefined {
    const existing = this.projectById(id);
    if (!existing) return undefined;
    const wasActive = existing.status !== 'Completed';
    const willBeActive = input.status !== 'Completed';
    const updated: Project = { ...existing, name: input.name.trim(), status: input.status, dueIso: input.dueIso, due: this.formatDate(input.dueIso), value: input.value, progress: input.progress, owner: input.owner.trim(), scope: input.scope.trim(), risk: input.risk.trim() || undefined };
    this.projectStore.update(items => items.map(project => project.id === id ? updated : project));
    if (wasActive !== willBeActive) {
      this.customerStore.update(items => items.map(customer => customer.id === existing.clientId ? { ...customer, activeProjects: Math.max(0, customer.activeProjects + (willBeActive ? 1 : -1)), lastActivity: 'Just now' } : customer));
    }
    return updated;
  }

  createCustomer(input: { name: string; contact: string; email: string; phone: string; city: string; status: Customer['status']; }): Customer {
    const nextNumber = Math.max(0, ...this.customerStore().map(customer => Number(customer.id.replace(/\D/g, '')) || 0)) + 1;
    const initials = input.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('');
    const customer: Customer = { id: `CU-${String(nextNumber).padStart(3, '0')}`, name: input.name.trim(), initials, contact: input.contact.trim(), email: input.email.trim(), phone: input.phone.trim(), city: input.city.trim(), activeProjects: 0, lifetimeValue: 0, lastActivity: 'Just now', status: input.status };
    this.customerStore.update(items => [customer, ...items]);
    return customer;
  }

  createInventoryItem(input: { name: string; category: string; sku: string; supplier: string; inStock: number; reserved: number; reorderAt: number; unit: string; unitCost: number; }): InventoryItem {
    const nextNumber = Math.max(0, ...this.inventoryStore().map(item => Number(item.id.replace(/\D/g, '')) || 0)) + 1;
    const status: InventoryItem['status'] = input.inStock <= 0 ? 'Out of stock' : input.inStock <= input.reorderAt ? 'Low stock' : 'Healthy';
    const item: InventoryItem = { id: `IN-${String(nextNumber).padStart(3, '0')}`, name: input.name.trim(), category: input.category.trim(), sku: input.sku.trim().toUpperCase(), supplier: input.supplier.trim(), inStock: input.inStock, reserved: input.reserved, reorderAt: input.reorderAt, unit: input.unit.trim(), unitCost: input.unitCost, status };
    this.inventoryStore.update(items => [item, ...items]);
    return item;
  }

  addCustomerNote(customerId: string, text: string): void {
    const clean = text.trim();
    if (!clean || !this.customerById(customerId)) return;
    const note = { id: `NT-${Date.now()}`, text: clean, createdAt: 'Just now' };
    this.customerNoteStore.update(store => ({ ...store, [customerId]: [note, ...(store[customerId] ?? [])] }));
    this.customerStore.update(items => items.map(customer => customer.id === customerId ? { ...customer, lastActivity: 'Just now' } : customer));
  }

  notesForCustomer(customerId: string) { return this.customerNoteStore()[customerId] ?? []; }

  createTask(input: { title: string; projectId: string; dueIso: string; priority: Priority; assignee: string; }): TaskItem {
    const project = this.projectById(input.projectId);
    if (!project) throw new Error('Choose a valid project.');
    const nextNumber = Math.max(0, ...this.taskStore().map(task => Number(task.id.replace(/\D/g, '')) || 0)) + 1;
    const task: TaskItem = { id: `TK-${String(nextNumber).padStart(3, '0')}`, title: input.title.trim(), projectId: project.id, project: project.name, when: this.relativeDue(input.dueIso), dueIso: input.dueIso, priority: input.priority, completed: false, assignee: input.assignee.trim() };
    this.taskStore.update(items => [task, ...items]);
    return task;
  }

  private formatDate(value: string): string {
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  }

  private relativeDue(value: string): string {
    const target = new Date(`${value}T12:00:00`).getTime();
    const today = new Date(); today.setHours(12,0,0,0);
    const days = Math.round((target - today.getTime()) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days > 1) return `In ${days} days`;
    if (days === -1) return 'Yesterday';
    return `${Math.abs(days)} days overdue`;
  }

  toggleTask(id: string) {
    this.taskStore.update(items => items.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  markNotificationRead(id: string) {
    this.notificationStore.update(items => items.map(note => note.id === id ? { ...note, unread: false } : note));
  }
}
