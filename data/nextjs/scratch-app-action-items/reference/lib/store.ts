import { ActionItem, Priority } from "./types";

let items: ActionItem[] = [];
let nextId = 1;

export function getItems(): ActionItem[] { return items; }

export function addItem(data: Omit<ActionItem, "id" | "createdAt">): ActionItem {
  const item: ActionItem = { ...data, id: String(nextId++), createdAt: new Date().toISOString() };
  items.push(item);
  return item;
}

export function updateItem(id: string, data: Partial<Omit<ActionItem, "id" | "createdAt">>): ActionItem | undefined {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  items[idx] = { ...items[idx], ...data };
  return items[idx];
}

export function deleteItem(id: string): boolean {
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  return true;
}

export function getCompleted(): ActionItem[] {
  return items.filter((i) => i.completed);
}

export function getByPriority(priority: Priority): ActionItem[] {
  return items.filter((i) => i.priority === priority);
}

export function getByAssignee(assignee: string): ActionItem[] {
  return items.filter((i) => i.assignee.toLowerCase() === assignee.toLowerCase());
}

export function __reset(): void {
  items = [];
  nextId = 1;
}
