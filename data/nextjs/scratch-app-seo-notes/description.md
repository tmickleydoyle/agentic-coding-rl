# scratch-app-seo-notes

An SEO research and notes tool for tracking keywords, page optimizations, backlinks, and generating reports.

## Routes
- `/` — Keywords: list keywords with search volume, difficulty, rank position, target URL
- `/pages` — Pages: page-level SEO audit notes (URL, title, meta desc, issues, score 0-100)
- `/backlinks` — Backlinks: track backlinks (source URL, target URL, anchor text, DA score, status)
- `/reports` — Reports: generate/view snapshot reports summarizing keyword rankings and page health

## Data model
### Keyword
```ts
{ id: string; keyword: string; volume: number; difficulty: number; position: number; targetUrl: string; notes: string; createdAt: number }
```
### PageAudit
```ts
{ id: string; url: string; title: string; metaDesc: string; issues: string[]; score: number; lastAudit: string; createdAt: number }
```
### Backlink
```ts
{ id: string; sourceUrl: string; targetUrl: string; anchorText: string; da: number; status: "active"|"lost"|"new"; createdAt: number }
```
### Report
```ts
{ id: string; generatedAt: string; totalKeywords: number; avgPosition: number; totalPages: number; avgScore: number; totalBacklinks: number; activeBacklinks: number }
```

## Seed data
Keywords: ["react hooks" (vol:5400, diff:45, pos:8, /blog/hooks), "nextjs tutorial" (vol:8900, diff:60, pos:15, /blog/nextjs), "typescript tips" (vol:3200, diff:35, pos:5, /blog/ts)]
Pages: ["/blog/hooks" (score:82, issues:["missing alt tags"]), "/blog/nextjs" (score:71, issues:["slow LCP","short meta"]), "/blog/ts" (score:90, issues:[])]
Backlinks: [techcrunch.com→/blog/hooks (DA:91, active), devto.com→/blog/nextjs (DA:72, active), oldblog.com→/blog/hooks (DA:25, lost)]

## Behaviors
- Keywords page: add keyword (requires keyword text); sort by position ascending
- Pages: add page audit requires URL; score 0-100
- Backlinks: add requires source/target URL; filter by status
- Reports: generate report computes aggregates from current data; list all past reports
- NavBar highlights active route

## Edge cases
- No backlinks shows "No backlinks tracked"
- Empty reports list shows "No reports generated"
