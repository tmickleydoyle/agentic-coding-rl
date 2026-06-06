import { Keyword, PageAudit, Backlink, Report, BacklinkStatus } from "./types";

export function __reset() {}
export function getKeywords(): Keyword[] { return []; }
export function addKeyword(_data: Omit<Keyword, "id" | "createdAt">): Keyword | { error: string } { return { error: "not implemented" }; }
export function deleteKeyword(_id: string): boolean { return false; }
export function getPages(): PageAudit[] { return []; }
export function addPage(_data: Omit<PageAudit, "id" | "createdAt">): PageAudit | { error: string } { return { error: "not implemented" }; }
export function getBacklinks(_status?: BacklinkStatus): Backlink[] { return []; }
export function addBacklink(_data: Omit<Backlink, "id" | "createdAt">): Backlink | { error: string } { return { error: "not implemented" }; }
export function generateReport(): Report {
  return { id: "", generatedAt: "", totalKeywords: 0, avgPosition: 0, totalPages: 0, avgScore: 0, totalBacklinks: 0, activeBacklinks: 0 };
}
export function getReports(): Report[] { return []; }
