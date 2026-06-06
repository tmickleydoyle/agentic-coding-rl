export type TaskCategory = "HR" | "IT" | "Legal" | "Culture";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  startDate: string;
  managerId: string;
}

export interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  dueOffset: number;
  category: TaskCategory;
}

export interface ChecklistItem {
  id: string;
  employeeId: string;
  templateId: string;
  completed: boolean;
}
