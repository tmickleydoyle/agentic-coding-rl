import type { Resident, NeighborhoodIssue, Announcement, IssueStatus } from "./types";

const seedResidents: Resident[] = [
  { id: "res1", name: "Alice Johnson", address: "12 Oak St", phone: "555-0101", moveIn: 2018 },
  { id: "res2", name: "Bob Kim", address: "14 Oak St", phone: "555-0102", moveIn: 2020 },
  { id: "res3", name: "Carol Davis", address: "16 Oak St", phone: "555-0103", moveIn: 2015 },
];

const seedIssues: NeighborhoodIssue[] = [
  { id: "i1", title: "Broken streetlight", category: "Maintenance", status: "Open", reporter: "Alice Johnson", date: "2024-05-10" },
  { id: "i2", title: "Speeding cars", category: "Safety", status: "In Progress", reporter: "Bob Kim", date: "2024-05-15" },
  { id: "i3", title: "Loud parties", category: "Noise", status: "Resolved", reporter: "Carol Davis", date: "2024-05-20" },
];

const seedAnnouncements: Announcement[] = [
  { id: "ann1", title: "Road closure next week", body: "Main St will be closed Mon-Wed.", author: "Admin", date: "2024-06-01", pinned: true },
  { id: "ann2", title: "New playground open", body: "The playground on Oak St is now open.", author: "Admin", date: "2024-06-05", pinned: false },
];

let residents: Resident[] = seedResidents.map((r) => ({ ...r }));
let issues: NeighborhoodIssue[] = seedIssues.map((i) => ({ ...i }));
let announcements: Announcement[] = seedAnnouncements.map((a) => ({ ...a }));
let nextResId = 4;

export function getResidents(): Resident[] { return residents; }
export function getIssues(): NeighborhoodIssue[] { return issues; }
export function getAnnouncements(): Announcement[] {
  return [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
}

export function addResident(name: string, address: string, phone: string, moveIn: number): Resident {
  const r: Resident = { id: `res${nextResId++}`, name, address, phone, moveIn };
  residents = [...residents, r];
  return r;
}

export function updateIssueStatus(id: string, status: IssueStatus): void {
  issues = issues.map((i) => i.id === id ? { ...i, status } : i);
}

export function togglePin(id: string): void {
  announcements = announcements.map((a) => a.id === id ? { ...a, pinned: !a.pinned } : a);
}

export function __reset(): void {
  residents = seedResidents.map((r) => ({ ...r }));
  issues = seedIssues.map((i) => ({ ...i }));
  announcements = seedAnnouncements.map((a) => ({ ...a }));
  nextResId = 4;
}
