import { TestBed } from '@angular/core/testing';
import { BusinessDataService } from './business-data.service';
import { MockBusinessRepository } from './mock-business.repository';

describe('BusinessDataService', () => {
  let service: BusinessDataService;
  let repository: MockBusinessRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    repository = TestBed.inject(MockBusinessRepository);
    service = TestBed.inject(BusinessDataService);
  });

  it('loads the mock workspace snapshot', async () => {
    await service.load();
    expect(service.loadState()).toBe('ready');
    expect(service.projects().length).toBeGreaterThan(0);
    expect(service.customers().length).toBeGreaterThan(0);
    expect(service.inventory().length).toBeGreaterThan(0);
  });

  it('toggles a task without mutating the rest of the task list', async () => {
    await service.load();
    const target = service.tasks()[0];
    const beforeLength = service.tasks().length;
    service.toggleTask(target.id);
    expect(service.tasks().length).toBe(beforeLength);
    expect(service.tasks().find(task => task.id === target.id)?.completed).toBe(!target.completed);
  });

  it('moves to error state and recovers on retry', async () => {
    await service.load();
    repository.failNextRequest();
    await service.load();
    expect(service.loadState()).toBe('error');
    expect(service.errorMessage()).toContain('could not be loaded');
    await service.load();
    expect(service.loadState()).toBe('ready');
  });

  it('creates a customer and a linked project, updating active work', async () => {
    await service.load();
    const customer = service.createCustomer({ name: 'Northline Studio', contact: 'Nora Lane', email: 'nora@example.com', phone: '+1 555 0112', city: 'Austin', status: 'Lead' });
    const before = customer.activeProjects;
    const project = service.createProject({ name: 'Retail rollout', clientId: customer.id, status: 'In progress', dueIso: '2026-10-20', value: 18000, owner: 'Mina Farrow', scope: 'Design and field rollout for two retail locations.' });
    expect(project.clientId).toBe(customer.id);
    expect(service.customerById(customer.id)?.activeProjects).toBe(before + 1);
  });

  it('creates a task linked to an existing project', async () => {
    await service.load();
    const project = service.projects()[0];
    const task = service.createTask({ title: 'Confirm client sign-off', projectId: project.id, dueIso: '2026-10-20', priority: 'High', assignee: 'Mina Farrow' });
    expect(task.projectId).toBe(project.id);
    expect(service.tasks()[0].id).toBe(task.id);
  });

  it('updates project progress and completion state', async () => {
    await service.load();
    const project = service.projects().find(item => item.status !== 'Completed')!;
    const customerBefore = service.customerById(project.clientId)!.activeProjects;
    service.updateProject(project.id, { name: project.name, status: 'Completed', dueIso: project.dueIso, value: project.value, progress: 100, owner: project.owner, scope: project.scope, risk: '' });
    expect(service.projectById(project.id)?.progress).toBe(100);
    expect(service.customerById(project.clientId)?.activeProjects).toBe(Math.max(0, customerBefore - 1));
  });

});
