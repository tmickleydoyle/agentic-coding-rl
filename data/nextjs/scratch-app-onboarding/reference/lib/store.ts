import { Employee, TaskTemplate, ChecklistItem } from "./types";

const SEED_EMPLOYEES: Employee[] = [
  { id: "1", name: "Eve Torres", email: "eve@co.com", department: "Engineering", startDate: "2024-02-01", managerId: "" },
  { id: "2", name: "Frank Liu", email: "frank@co.com", department: "Marketing", startDate: "2024-02-05", managerId: "" },
];

const SEED_TEMPLATES: TaskTemplate[] = [
  { id: "1", title: "Sign offer letter", description: "DocuSign the offer", dueOffset: 1, category: "HR" },
  { id: "2", title: "Setup laptop", description: "IT setup and config", dueOffset: 1, category: "IT" },
  { id: "3", title: "Complete I-9", description: "Fill out I-9 form", dueOffset: 3, category: "Legal" },
  { id: "4", title: "Team intro meeting", description: "Meet the team", dueOffset: 5, category: "Culture" },
];

function generateChecklist(employees: Employee[], templates: TaskTemplate[]): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  let id = 1;
  employees.forEach((e) => {
    templates.forEach((t) => {
      items.push({ id: String(id++), employeeId: e.id, templateId: t.id, completed: false });
    });
  });
  return items;
}

let employees: Employee[] = SEED_EMPLOYEES.map((e) => ({ ...e }));
let templates: TaskTemplate[] = SEED_TEMPLATES.map((t) => ({ ...t }));
let checklist: ChecklistItem[] = generateChecklist(employees, templates);
let nextEmpId = 3;
let nextTplId = 5;
let nextItemId = checklist.length + 1;

export function getEmployees(): Employee[] { return employees.map((e) => ({ ...e })); }

export function addEmployee(data: Omit<Employee, "id">): Employee {
  const e: Employee = { ...data, id: String(nextEmpId++) };
  employees.push(e);
  // auto-generate checklist items
  templates.forEach((t) => {
    checklist.push({ id: String(nextItemId++), employeeId: e.id, templateId: t.id, completed: false });
  });
  return { ...e };
}

export function getTemplates(): TaskTemplate[] { return templates.map((t) => ({ ...t })); }

export function addTemplate(data: Omit<TaskTemplate, "id">): TaskTemplate {
  const t: TaskTemplate = { ...data, id: String(nextTplId++) };
  templates.push(t);
  employees.forEach((e) => {
    checklist.push({ id: String(nextItemId++), employeeId: e.id, templateId: t.id, completed: false });
  });
  return { ...t };
}

export function deleteTemplate(id: string): boolean {
  const idx = templates.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  templates.splice(idx, 1);
  checklist = checklist.filter((c) => c.templateId !== id);
  return true;
}

export function getChecklist(): ChecklistItem[] { return checklist.map((c) => ({ ...c })); }

export function toggleChecklist(id: string): ChecklistItem | null {
  const idx = checklist.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  checklist[idx] = { ...checklist[idx], completed: !checklist[idx].completed };
  return { ...checklist[idx] };
}

export function __reset(): void {
  employees = SEED_EMPLOYEES.map((e) => ({ ...e }));
  templates = SEED_TEMPLATES.map((t) => ({ ...t }));
  checklist = generateChecklist(employees, templates);
  nextEmpId = 3;
  nextTplId = 5;
  nextItemId = checklist.length + 1;
}
