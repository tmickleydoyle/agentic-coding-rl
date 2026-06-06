import type { StudyGroup, Member, GroupSession } from "./types";

let groups: StudyGroup[] = [
  { id: "g1", name: "Calculus Crew", subject: "Math", description: "Conquer calculus together", maxMembers: 6, memberIds: ["m1", "m2"], meetingFormat: "online" },
  { id: "g2", name: "History Buffs", subject: "History", description: "World history deep dives", maxMembers: 8, memberIds: ["m1"], meetingFormat: "in-person" },
  { id: "g3", name: "Code Club", subject: "Computer Science", description: "Learn algorithms and data structures", maxMembers: 10, memberIds: ["m2", "m3"], meetingFormat: "hybrid" },
];

let members: Member[] = [
  { id: "m1", name: "Alice Johnson", email: "alice@example.com", groupIds: ["g1", "g2"] },
  { id: "m2", name: "Bob Smith", email: "bob@example.com", groupIds: ["g1", "g3"] },
  { id: "m3", name: "Carol Lee", email: "carol@example.com", groupIds: ["g3"] },
];

let sessions: GroupSession[] = [
  { id: "s1", groupId: "g1", groupName: "Calculus Crew", topic: "Derivatives", date: "2024-03-05", durationMinutes: 60, format: "online" },
  { id: "s2", groupId: "g3", groupName: "Code Club", topic: "Binary Trees", date: "2024-03-07", durationMinutes: 90, format: "hybrid" },
];

let nextId = 100;

export function getGroups(): StudyGroup[] { return [...groups]; }
export function getMembers(): Member[] { return [...members]; }
export function getSessions(): GroupSession[] { return [...sessions]; }

export function addGroup(data: Omit<StudyGroup, "id">): StudyGroup {
  const g: StudyGroup = { ...data, id: `g${nextId++}` };
  groups.push(g);
  return g;
}

export function addMember(data: Omit<Member, "id">): Member {
  const m: Member = { ...data, id: `m${nextId++}` };
  members.push(m);
  return m;
}

export function joinGroup(memberId: string, groupId: string): boolean {
  const member = members.find(m => m.id === memberId);
  const group = groups.find(g => g.id === groupId);
  if (!member || !group) return false;
  if (group.memberIds.length >= group.maxMembers) return false;
  if (group.memberIds.includes(memberId)) return false;
  group.memberIds.push(memberId);
  member.groupIds.push(groupId);
  return true;
}

export function leaveGroup(memberId: string, groupId: string): boolean {
  const member = members.find(m => m.id === memberId);
  const group = groups.find(g => g.id === groupId);
  if (!member || !group) return false;
  group.memberIds = group.memberIds.filter(id => id !== memberId);
  member.groupIds = member.groupIds.filter(id => id !== groupId);
  return true;
}

export function addSession(data: Omit<GroupSession, "id">): GroupSession {
  const s: GroupSession = { ...data, id: `s${nextId++}` };
  sessions.push(s);
  return s;
}

export function deleteGroup(id: string): boolean {
  const before = groups.length;
  groups = groups.filter(g => g.id !== id);
  return groups.length < before;
}

export function __reset(): void {
  groups = [
    { id: "g1", name: "Calculus Crew", subject: "Math", description: "Conquer calculus together", maxMembers: 6, memberIds: ["m1", "m2"], meetingFormat: "online" },
    { id: "g2", name: "History Buffs", subject: "History", description: "World history deep dives", maxMembers: 8, memberIds: ["m1"], meetingFormat: "in-person" },
    { id: "g3", name: "Code Club", subject: "Computer Science", description: "Learn algorithms and data structures", maxMembers: 10, memberIds: ["m2", "m3"], meetingFormat: "hybrid" },
  ];
  members = [
    { id: "m1", name: "Alice Johnson", email: "alice@example.com", groupIds: ["g1", "g2"] },
    { id: "m2", name: "Bob Smith", email: "bob@example.com", groupIds: ["g1", "g3"] },
    { id: "m3", name: "Carol Lee", email: "carol@example.com", groupIds: ["g3"] },
  ];
  sessions = [
    { id: "s1", groupId: "g1", groupName: "Calculus Crew", topic: "Derivatives", date: "2024-03-05", durationMinutes: 60, format: "online" },
    { id: "s2", groupId: "g3", groupName: "Code Club", topic: "Binary Trees", date: "2024-03-07", durationMinutes: 90, format: "hybrid" },
  ];
  nextId = 100;
}
