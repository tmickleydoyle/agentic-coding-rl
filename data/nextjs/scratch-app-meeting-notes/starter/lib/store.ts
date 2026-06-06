import { Meeting } from "./types";

export function getMeetings(): Meeting[] { return []; }
export function getMeetingById(_id: string): Meeting | undefined { return undefined; }
export function addMeeting(_data: Omit<Meeting, "id" | "createdAt">): Meeting {
  return { id: "", title: "", date: "", attendees: "", agenda: [], notes: "", actionItems: "", createdAt: "" };
}
export function updateMeeting(_id: string, _data: Partial<Omit<Meeting, "id" | "createdAt">>): Meeting | undefined { return undefined; }
export function deleteMeeting(_id: string): boolean { return false; }
export function searchMeetings(_q: string): Meeting[] { return []; }
export function __reset(): void {}
