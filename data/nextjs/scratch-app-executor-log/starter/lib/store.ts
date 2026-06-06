import { ExecutorTask, Contact, TaskStatus } from "./types";

export const TODAY = "2024-07-01";

export interface StoreState {
  tasks: ExecutorTask[];
  contacts: Contact[];
}

export function getState(): StoreState {
  return { tasks: [], contacts: [] };
}

export function addTask(_t: Omit<ExecutorTask, "id">): ExecutorTask {
  return { id: "", title: "", description: "", due: "", status: "Todo" };
}

export function deleteTask(_id: string): void {}

export function updateTaskStatus(_id: string, _status: TaskStatus): void {}

export function addContact(_c: Omit<Contact, "id">): Contact {
  return { id: "", name: "", role: "Other", phone: "" };
}

export function deleteContact(_id: string): void {}

export function getSummary(): { total: number; done: number; overdue: number } {
  return { total: 0, done: 0, overdue: 0 };
}

export function __reset(): void {}
