export type BacklinkStatus = "active" | "lost" | "new";

export interface Keyword {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  position: number;
  targetUrl: string;
  notes: string;
  createdAt: number;
}

export interface PageAudit {
  id: string;
  url: string;
  title: string;
  metaDesc: string;
  issues: string[];
  score: number;
  lastAudit: string;
  createdAt: number;
}

export interface Backlink {
  id: string;
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  da: number;
  status: BacklinkStatus;
  createdAt: number;
}

export interface Report {
  id: string;
  generatedAt: string;
  totalKeywords: number;
  avgPosition: number;
  totalPages: number;
  avgScore: number;
  totalBacklinks: number;
  activeBacklinks: number;
}

export type Route = "keywords" | "pages" | "backlinks" | "reports";
