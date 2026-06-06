import type { StudyGroup, Member, GroupSession } from "./types";

export function getGroups(): StudyGroup[] { return []; }
export function getMembers(): Member[] { return []; }
export function getSessions(): GroupSession[] { return []; }
export function addGroup(_data: Omit<StudyGroup, "id">): StudyGroup { throw new Error("Not implemented"); }
export function addMember(_data: Omit<Member, "id">): Member { throw new Error("Not implemented"); }
export function joinGroup(_memberId: string, _groupId: string): boolean { return false; }
export function leaveGroup(_memberId: string, _groupId: string): boolean { return false; }
export function addSession(_data: Omit<GroupSession, "id">): GroupSession { throw new Error("Not implemented"); }
export function deleteGroup(_id: string): boolean { return false; }
export function __reset(): void {}
