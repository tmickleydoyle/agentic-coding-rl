import { Employee, TaskTemplate, ChecklistItem } from "./types";

export function getEmployees(): Employee[] { return []; }
export function addEmployee(_data: Omit<Employee, "id">): Employee {
  return { id: "", name: "", email: "", department: "", startDate: "", managerId: "" };
}
export function getTemplates(): TaskTemplate[] { return []; }
export function addTemplate(_data: Omit<TaskTemplate, "id">): TaskTemplate {
  return { id: "", title: "", description: "", dueOffset: 1, category: "HR" };
}
export function deleteTemplate(_id: string): boolean { return false; }
export function getChecklist(): ChecklistItem[] { return []; }
export function toggleChecklist(_id: string): ChecklistItem | null { return null; }
export function __reset(): void {}
