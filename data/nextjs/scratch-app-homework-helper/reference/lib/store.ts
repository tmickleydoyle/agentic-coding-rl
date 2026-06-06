import type { Assignment, StudyNote, SubjectStats, AssignmentStatus, Priority } from "./types";

let assignments: Assignment[] = [
  { id: "a1", title: "Chapter 5 Problems", subject: "Math", dueDate: "2024-03-15", priority: "high", status: "todo", description: "Complete exercises 1-20", estimatedMinutes: 60 },
  { id: "a2", title: "Essay Draft", subject: "English", dueDate: "2024-03-18", priority: "medium", status: "in-progress", description: "Write first draft of persuasive essay", estimatedMinutes: 90 },
  { id: "a3", title: "Lab Report", subject: "Science", dueDate: "2024-03-12", priority: "high", status: "done", description: "Write up the photosynthesis lab", estimatedMinutes: 45 },
  { id: "a4", title: "Reading Ch 7-8", subject: "History", dueDate: "2024-03-20", priority: "low", status: "todo", description: "Read and take notes", estimatedMinutes: 30 },
];

let notes: StudyNote[] = [
  { id: "n1", subject: "Math", title: "Quadratic Formula", content: "x = (-b ± √(b²-4ac)) / 2a", createdAt: "2024-03-01" },
  { id: "n2", subject: "English", title: "Essay Structure", content: "Intro, 3 body paragraphs, conclusion", createdAt: "2024-03-05" },
];

let nextId = 100;

export function getAssignments(): Assignment[] { return [...assignments]; }
export function getNotes(): StudyNote[] { return [...notes]; }

export function addAssignment(data: Omit<Assignment, "id">): Assignment {
  const a: Assignment = { ...data, id: `a${nextId++}` };
  assignments.push(a);
  return a;
}

export function updateAssignmentStatus(id: string, status: AssignmentStatus): Assignment | null {
  const a = assignments.find(x => x.id === id);
  if (!a) return null;
  a.status = status;
  return { ...a };
}

export function deleteAssignment(id: string): boolean {
  const before = assignments.length;
  assignments = assignments.filter(a => a.id !== id);
  return assignments.length < before;
}

export function addNote(data: Omit<StudyNote, "id">): StudyNote {
  const n: StudyNote = { ...data, id: `n${nextId++}` };
  notes.push(n);
  return n;
}

export function deleteNote(id: string): boolean {
  const before = notes.length;
  notes = notes.filter(n => n.id !== id);
  return notes.length < before;
}

export function getSubjectStats(): SubjectStats[] {
  const map: Record<string, SubjectStats> = {};
  assignments.forEach(a => {
    if (!map[a.subject]) map[a.subject] = { subject: a.subject, total: 0, done: 0 };
    map[a.subject].total++;
    if (a.status === "done") map[a.subject].done++;
  });
  return Object.values(map);
}

export function getOverdueCount(today: string): number {
  return assignments.filter(a => a.dueDate < today && a.status !== "done").length;
}

export function __reset(): void {
  assignments = [
    { id: "a1", title: "Chapter 5 Problems", subject: "Math", dueDate: "2024-03-15", priority: "high", status: "todo", description: "Complete exercises 1-20", estimatedMinutes: 60 },
    { id: "a2", title: "Essay Draft", subject: "English", dueDate: "2024-03-18", priority: "medium", status: "in-progress", description: "Write first draft of persuasive essay", estimatedMinutes: 90 },
    { id: "a3", title: "Lab Report", subject: "Science", dueDate: "2024-03-12", priority: "high", status: "done", description: "Write up the photosynthesis lab", estimatedMinutes: 45 },
    { id: "a4", title: "Reading Ch 7-8", subject: "History", dueDate: "2024-03-20", priority: "low", status: "todo", description: "Read and take notes", estimatedMinutes: 30 },
  ];
  notes = [
    { id: "n1", subject: "Math", title: "Quadratic Formula", content: "x = (-b ± √(b²-4ac)) / 2a", createdAt: "2024-03-01" },
    { id: "n2", subject: "English", title: "Essay Structure", content: "Intro, 3 body paragraphs, conclusion", createdAt: "2024-03-05" },
  ];
  nextId = 100;
}
