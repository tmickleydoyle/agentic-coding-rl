import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getEntries, addEntry, deleteEntry, getProjects, addProject, deleteProject, getGoals, addGoal } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Entries API", () => {
  it("returns seed entries", () => {
    const entries = getEntries();
    expect(entries.length).toBe(3);
  });

  it("adds a valid entry", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = addEntry({ projectId: "p1", date: today, wordCount: 200, notes: "" });
    expect("id" in result).toBe(true);
    expect(getEntries().length).toBe(4);
  });

  it("rejects entry with zero word count", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = addEntry({ projectId: "p1", date: today, wordCount: 0, notes: "" });
    expect("error" in result).toBe(true);
  });

  it("rejects entry with negative word count", () => {
    const today = new Date().toISOString().split("T")[0];
    const result = addEntry({ projectId: "p1", date: today, wordCount: -10, notes: "" });
    expect("error" in result).toBe(true);
  });

  it("deletes an entry", () => {
    const ok = deleteEntry("e1");
    expect(ok).toBe(true);
    expect(getEntries().length).toBe(2);
  });

  it("returns false for unknown delete", () => {
    expect(deleteEntry("nonexistent")).toBe(false);
  });
});

describe("Projects API", () => {
  it("returns 3 seed projects", () => {
    expect(getProjects().length).toBe(3);
  });

  it("adds a project", () => {
    addProject({ name: "Test", dailyGoal: 100, color: "purple" });
    expect(getProjects().length).toBe(4);
  });

  it("prevents deleting project with entries", () => {
    const result = deleteProject("p1");
    expect(result.error).toBeTruthy();
  });
});

describe("Goals API", () => {
  it("returns 2 seed goals", () => {
    expect(getGoals().length).toBe(2);
  });

  it("adds a goal", () => {
    const today = new Date().toISOString().split("T")[0];
    addGoal({ projectId: "p1", type: "daily", target: 300, startDate: today, completed: false });
    expect(getGoals().length).toBe(3);
  });
});
