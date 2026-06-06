import { ActionItem, Priority } from "./types";

export function getItems(): ActionItem[] { return []; }
export function addItem(_data: Omit<ActionItem, "id" | "createdAt">): ActionItem {
  return { id: "", title: "", assignee: "", dueDate: "", priority: "medium", completed: false, notes: "", createdAt: "" };
}
export function updateItem(_id: string, _data: Partial<Omit<ActionItem, "id" | "createdAt">>): ActionItem | undefined { return undefined; }
export function deleteItem(_id: string): boolean { return false; }
export function getCompleted(): ActionItem[] { return []; }
export function getByPriority(_priority: Priority): ActionItem[] { return []; }
export function getByAssignee(_assignee: string): ActionItem[] { return []; }
export function __reset(): void {}
