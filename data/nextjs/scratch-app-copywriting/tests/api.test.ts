import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getProjects, addProject, getBriefs, addBrief, getCopies, addCopy, updateCopyStatus, rateCopy } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Copywriting store", () => {
  it("returns 3 projects", () => { expect(getProjects().length).toBe(3); });
  it("adds project", () => {
    addProject({ name: "New Campaign", client: "BrandX", status: "active", deadline: "2030-08-01" });
    expect(getProjects().length).toBe(4);
  });
  it("rejects project without name", () => {
    const r = addProject({ name: "", client: "X", status: "active", deadline: "" });
    expect("error" in r).toBe(true);
  });

  it("returns 2 briefs", () => { expect(getBriefs().length).toBe(2); });
  it("adds brief", () => {
    addBrief({ projectId: "pr3", audience: "shoppers", tone: "friendly", goal: "sales", keyMessages: "deals" });
    expect(getBriefs().length).toBe(3);
  });
  it("rejects duplicate brief for project", () => {
    const r = addBrief({ projectId: "pr1", audience: "x", tone: "x", goal: "x", keyMessages: "x" });
    expect("error" in r).toBe(true);
  });

  it("returns 3 copies", () => { expect(getCopies().length).toBe(3); });
  it("returns review copies", () => { expect(getCopies("review").length).toBe(2); });
  it("adds copy", () => {
    addCopy({ briefId: "b1", headline: "New Head", body: "Body text", cta: "Click", status: "draft", rating: 0 });
    expect(getCopies().length).toBe(4);
  });
  it("rejects copy with invalid rating", () => {
    const r = addCopy({ briefId: "b1", headline: "X", body: "Y", cta: "", status: "draft", rating: 6 });
    expect("error" in r).toBe(true);
  });
  it("updates copy status", () => {
    const r = updateCopyStatus("cp2", "approved");
    expect(r?.status).toBe("approved");
  });
  it("rates copy", () => {
    const r = rateCopy("cp1", 5);
    if (!("error" in r)) expect(r.rating).toBe(5);
  });
});
