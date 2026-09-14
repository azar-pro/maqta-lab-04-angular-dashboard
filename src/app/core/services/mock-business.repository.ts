import { Injectable } from '@angular/core';
import { customers, inventory, notifications, projects, tasks } from '../../data/mock-data';
import { Customer, InventoryItem, NotificationItem, Project, TaskItem } from '../models/business.models';

export interface BusinessSnapshot {
  projects: Project[];
  customers: Customer[];
  inventory: InventoryItem[];
  tasks: TaskItem[];
  notifications: NotificationItem[];
}

@Injectable({ providedIn: 'root' })
export class MockBusinessRepository {
  private failNext = false;

  failNextRequest(): void {
    this.failNext = true;
  }

  async loadSnapshot(): Promise<BusinessSnapshot> {
    await new Promise(resolve => setTimeout(resolve, 450));
    if (this.failNext) {
      this.failNext = false;
      throw new Error('Workspace data could not be loaded.');
    }
    return {
      projects: structuredClone(projects),
      customers: structuredClone(customers),
      inventory: structuredClone(inventory),
      tasks: structuredClone(tasks),
      notifications: structuredClone(notifications)
    };
  }
}
