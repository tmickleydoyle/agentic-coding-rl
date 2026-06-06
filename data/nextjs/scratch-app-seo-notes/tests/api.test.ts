import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getKeywords, addKeyword, deleteKeyword, getPages, addPage, getBacklinks, addBacklink, generateReport, getReports } from "../lib/store";

beforeEach(() => { __reset(); });

describe("SEO store", () => {
  it("returns 3 keywords sorted by position", () => {
    const kws = getKeywords();
    expect(kws.length).toBe(3);
    expect(kws[0].position).toBeLessThanOrEqual(kws[1].position);
  });
  it("adds keyword", () => {
    addKeyword({ keyword: "seo basics", volume: 1000, difficulty: 20, position: 10, targetUrl: "/seo", notes: "" });
    expect(getKeywords().length).toBe(4);
  });
  it("rejects keyword without text", () => {
    const r = addKeyword({ keyword: "", volume: 0, difficulty: 0, position: 0, targetUrl: "", notes: "" });
    expect("error" in r).toBe(true);
  });
  it("deletes keyword", () => {
    deleteKeyword("k1");
    expect(getKeywords().length).toBe(2);
  });

  it("returns 3 pages", () => { expect(getPages().length).toBe(3); });
  it("adds page", () => {
    addPage({ url: "/new", title: "New", metaDesc: "", issues: [], score: 75, lastAudit: "2030-06-01" });
    expect(getPages().length).toBe(4);
  });
  it("rejects page with score over 100", () => {
    const r = addPage({ url: "/x", title: "X", metaDesc: "", issues: [], score: 101, lastAudit: "2030-06-01" });
    expect("error" in r).toBe(true);
  });

  it("returns 3 backlinks", () => { expect(getBacklinks().length).toBe(3); });
  it("filters active backlinks", () => { expect(getBacklinks("active").length).toBe(2); });
  it("adds backlink", () => {
    addBacklink({ sourceUrl: "new.com", targetUrl: "/blog/ts", anchorText: "ts", da: 50, status: "new" });
    expect(getBacklinks().length).toBe(4);
  });

  it("generates a report", () => {
    const r = generateReport();
    expect(r.totalKeywords).toBe(3);
    expect(r.totalPages).toBe(3);
    expect(r.activeBacklinks).toBe(2);
    expect(getReports().length).toBe(1);
  });
});
