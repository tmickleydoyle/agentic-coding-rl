import { ExecutorTask, Contact, TaskStatus } from "./types";

export const TODAY = "2024-07-01";

export interface StoreState {
  tasks: ExecutorTask[];
  contacts: Contact[];
}

let state: StoreState = {
  tasks: [
    { id: "t1", title: "File Probate Application", description: "Submit to court", due: "2024-06-01", status: "Done" },
    { id: "t2", title: "Notify Banks", description: "Send death certificate", due: "2024-07-15", status: "InProgress" },
    { id: "t3", title: "Sell Property", description: "List on market", due: "2024-08-01", status: "Todo" },
    { id: "t4", title: "Close Tax Affairs", description: "File final return", due: "2024-06-30", status: "Todo" },
  ],
  contacts: [
    { id: "c1", name: "James White", role: "Solicitor", phone: "01234 567890" },
    { id: "c2", name: "Sarah Green", role: "Accountant", phone: "09876 543210" },
  ],
};

export function getState(): StoreState {
  return state;
}

export function addTask(t: Omit<ExecutorTask, "id">): ExecutorTask {
  const newT: ExecutorTask = { id: `t-${Date.now()}`, ...t };
  state = { ...state, tasks: [...state.tasks, newT] };
  return newT;
}

export function deleteTask(id: string): void {
  state = { ...state, tasks: state.tasks.filter((t) => t.id !== id) };
}

export function updateTaskStatus(id: string, status: TaskStatus): void {
  state = {
    ...state,
    tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
  };
}

export function addContact(c: Omit<Contact, "id">): Contact {
  const newC: Contact = { id: `c-${Date.now()}`, ...c };
  state = { ...state, contacts: [...state.contacts, newC] };
  return newC;
}

export function deleteContact(id: string): void {
  state = { ...state, contacts: state.contacts.filter((c) => c.id !== id) };
}

export function getSummary(): { total: number; done: number; overdue: number } {
  const total = state.tasks.length;
  const done = state.tasks.filter((t) => t.status === "Done").length;
  const overdue = state.tasks.filter((t) => t.due < TODAY && t.status !== "Done").length;
  return { total, done, overdue };
}

export function __reset(): void {
  state = {
    tasks: [
      { id: "t1", title: "File Probate Application", description: "Submit to court", due: "2024-06-01", status: "Done" },
      { id: "t2", title: "Notify Banks", description: "Send death certificate", due: "2024-07-15", status: "InProgress" },
      { id: "t3", title: "Sell Property", description: "List on market", due: "2024-08-01", status: "Todo" },
      { id: "t4", title: "Close Tax Affairs", description: "File final return", due: "2024-06-30", status: "Todo" },
    ],
    contacts: [
      { id: "c1", name: "James White", role: "Solicitor", phone: "01234 567890" },
      { id: "c2", name: "Sarah Green", role: "Accountant", phone: "09876 543210" },
    ],
  };
}
