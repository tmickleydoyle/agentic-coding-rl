export type IssueCategory = "Safety" | "Maintenance" | "Noise" | "Other";
export type IssueStatus = "Open" | "In Progress" | "Resolved";
export interface Resident { id: string; name: string; address: string; phone: string; moveIn: number; }
export interface NeighborhoodIssue { id: string; title: string; category: IssueCategory; status: IssueStatus; reporter: string; date: string; }
export interface Announcement { id: string; title: string; body: string; author: string; date: string; pinned: boolean; }
