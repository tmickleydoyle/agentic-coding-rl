export type Subject = "Math" | "Science" | "History" | "English" | "Computer Science" | "Art";
export type MeetingFormat = "in-person" | "online" | "hybrid";

export interface StudyGroup {
  id: string;
  name: string;
  subject: Subject;
  description: string;
  maxMembers: number;
  memberIds: string[];
  meetingFormat: MeetingFormat;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  groupIds: string[];
}

export interface GroupSession {
  id: string;
  groupId: string;
  groupName: string;
  topic: string;
  date: string;
  durationMinutes: number;
  format: MeetingFormat;
}

export type Route = "home" | "groups" | "members" | "sessions";
