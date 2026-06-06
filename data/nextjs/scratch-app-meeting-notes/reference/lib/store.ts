import { Meeting } from "./types";

let meetings: Meeting[] = [];
let nextId = 1;

export function getMeetings(): Meeting[] { return meetings; }

export function getMeetingById(id: string): Meeting | undefined {
  return meetings.find((m) => m.id === id);
}

export function addMeeting(data: Omit<Meeting, "id" | "createdAt">): Meeting {
  const m: Meeting = { ...data, id: String(nextId++), createdAt: new Date().toISOString() };
  meetings.push(m);
  return m;
}

export function updateMeeting(id: string, data: Partial<Omit<Meeting, "id" | "createdAt">>): Meeting | undefined {
  const idx = meetings.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  meetings[idx] = { ...meetings[idx], ...data };
  return meetings[idx];
}

export function deleteMeeting(id: string): boolean {
  const idx = meetings.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  meetings.splice(idx, 1);
  return true;
}

export function searchMeetings(q: string): Meeting[] {
  const query = q.toLowerCase();
  return meetings.filter(
    (m) =>
      m.title.toLowerCase().includes(query) ||
      m.notes.toLowerCase().includes(query) ||
      m.attendees.toLowerCase().includes(query)
  );
}

export function __reset(): void {
  meetings = [];
  nextId = 1;
}
