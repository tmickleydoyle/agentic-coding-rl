import type { Resident, NeighborhoodIssue, Announcement, IssueStatus } from "./types";
export function getResidents(): Resident[] { return []; }
export function getIssues(): NeighborhoodIssue[] { return []; }
export function getAnnouncements(): Announcement[] { return []; }
export function addResident(_name: string, _address: string, _phone: string, _moveIn: number): Resident { return { id: "", name: "", address: "", phone: "", moveIn: 0 }; }
export function updateIssueStatus(_id: string, _status: IssueStatus): void {}
export function togglePin(_id: string): void {}
export function __reset(): void {}
