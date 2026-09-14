export type ProjectStatus = 'In progress' | 'Review' | 'On hold' | 'Completed';
export type Priority = 'High' | 'Medium' | 'Low';
export type InventoryStatus = 'Healthy' | 'Low stock' | 'Ordered' | 'Out of stock';

export interface Project {
  id: string;
  name: string;
  clientId: string;
  client: string;
  status: ProjectStatus;
  due: string;
  dueIso: string;
  value: number;
  progress: number;
  owner: string;
  risk?: string;
  scope: string;
}

export interface Customer {
  id: string;
  name: string;
  initials: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  activeProjects: number;
  lifetimeValue: number;
  lastActivity: string;
  status: 'Active' | 'Lead' | 'Dormant';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  supplier: string;
  inStock: number;
  reserved: number;
  reorderAt: number;
  unit: string;
  unitCost: number;
  status: InventoryStatus;
  project?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  projectId: string;
  project: string;
  when: string;
  dueIso: string;
  priority: Priority;
  completed: boolean;
  assignee: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  when: string;
  unread: boolean;
  type: 'risk' | 'task' | 'inventory' | 'client';
}
