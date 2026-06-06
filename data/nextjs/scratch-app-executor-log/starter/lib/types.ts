export type TaskStatus = "Todo" | "InProgress" | "Done";
export type ContactRole = "Solicitor" | "Accountant" | "Bank" | "Other";

export interface ExecutorTask {
  id: string;
  title: string;
  description: string;
  due: string;
  status: TaskStatus;
}

export interface Contact {
  id: string;
  name: string;
  role: ContactRole;
  phone: string;
}
