import { Keyword, PageAudit, Backlink, Report, BacklinkStatus } from "./types";

const seedKeywords: Keyword[] = [
  { id: "k1", keyword: "react hooks", volume: 5400, difficulty: 45, position: 8, targetUrl: "/blog/hooks", notes: "", createdAt: 1000 },
  { id: "k2", keyword: "nextjs tutorial", volume: 8900, difficulty: 60, position: 15, targetUrl: "/blog/nextjs", notes: "", createdAt: 2000 },
  { id: "k3", keyword: "typescript tips", volume: 3200, difficulty: 35, position: 5, targetUrl: "/blog/ts", notes: "", createdAt: 3000 },
];
const seedPages: PageAudit[] = [
  { id: "pa1", url: "/blog/hooks", title: "React Hooks Guide", metaDesc: "Learn hooks", issues: ["missing alt tags"], score: 82, lastAudit: "2030-05-01", createdAt: 1000 },
  { id: "pa2", url: "/blog/nextjs", title: "Next.js Tutorial", metaDesc: "Get started", issues: ["slow LCP", "short meta"], score: 71, lastAudit: "2030-05-02", createdAt: 2000 },
  { id: "pa3", url: "/blog/ts", title: "TypeScript Tips", metaDesc: "TS best practices", issues: [], score: 90, lastAudit: "2030-05-03", createdAt: 3000 },
];
const seedBacklinks: Backlink[] = [
  { id: "bl1", sourceUrl: "techcrunch.com", targetUrl: "/blog/hooks", anchorText: "react hooks", da: 91, status: "active", createdAt: 1000 },
  { id: "bl2", sourceUrl: "devto.com", targetUrl: "/blog/nextjs", anchorText: "nextjs tutorial", da: 72, status: "active", createdAt: 2000 },
  { id: "bl3", sourceUrl: "oldblog.com", targetUrl: "/blog/hooks", anchorText: "hooks guide", da: 25, status: "lost", createdAt: 3000 },
];

let keywords: Keyword[] = seedKeywords.map((k) => ({ ...k }));
let pages: PageAudit[] = seedPages.map((p) => ({ ...p, issues: [...p.issues] }));
let backlinks: Backlink[] = seedBacklinks.map((b) => ({ ...b }));
let reports: Report[] = [];

export function __reset() {
  keywords = seedKeywords.map((k) => ({ ...k }));
  pages = seedPages.map((p) => ({ ...p, issues: [...p.issues] }));
  backlinks = seedBacklinks.map((b) => ({ ...b }));
  reports = [];
}

export function getKeywords(): Keyword[] {
  return keywords.map((k) => ({ ...k })).sort((a, b) => a.position - b.position);
}
export function addKeyword(data: Omit<Keyword, "id" | "createdAt">): Keyword | { error: string } {
  if (!data.keyword.trim()) return { error: "Keyword text required" };
  const k: Keyword = { id: `k${Date.now()}`, createdAt: Date.now(), ...data };
  keywords.push(k);
  return { ...k };
}
export function deleteKeyword(id: string): boolean {
  const before = keywords.length;
  keywords = keywords.filter((k) => k.id !== id);
  return keywords.length < before;
}

export function getPages(): PageAudit[] { return pages.map((p) => ({ ...p, issues: [...p.issues] })); }
export function addPage(data: Omit<PageAudit, "id" | "createdAt">): PageAudit | { error: string } {
  if (!data.url.trim()) return { error: "URL required" };
  if (data.score < 0 || data.score > 100) return { error: "Score must be 0-100" };
  const p: PageAudit = { id: `pa${Date.now()}`, createdAt: Date.now(), ...data, issues: [...(data.issues || [])] };
  pages.push(p);
  return { ...p, issues: [...p.issues] };
}

export function getBacklinks(status?: BacklinkStatus): Backlink[] {
  const list = backlinks.map((b) => ({ ...b }));
  if (status) return list.filter((b) => b.status === status);
  return list;
}
export function addBacklink(data: Omit<Backlink, "id" | "createdAt">): Backlink | { error: string } {
  if (!data.sourceUrl.trim() || !data.targetUrl.trim()) return { error: "Source and target URL required" };
  const b: Backlink = { id: `bl${Date.now()}`, createdAt: Date.now(), ...data };
  backlinks.push(b);
  return { ...b };
}

export function generateReport(): Report {
  const avgPos = keywords.length === 0 ? 0 : Math.round(keywords.reduce((s, k) => s + k.position, 0) / keywords.length);
  const avgScore = pages.length === 0 ? 0 : Math.round(pages.reduce((s, p) => s + p.score, 0) / pages.length);
  const activeBacklinks = backlinks.filter((b) => b.status === "active").length;
  const report: Report = {
    id: `r${Date.now()}`,
    generatedAt: new Date().toISOString(),
    totalKeywords: keywords.length,
    avgPosition: avgPos,
    totalPages: pages.length,
    avgScore,
    totalBacklinks: backlinks.length,
    activeBacklinks,
  };
  reports.push(report);
  return { ...report };
}
export function getReports(): Report[] { return reports.map((r) => ({ ...r })); }
