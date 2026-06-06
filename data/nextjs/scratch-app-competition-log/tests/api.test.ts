import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getCompetitions, addCompetition, deleteCompetition, addResult } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Store API", () => {
  it("returns 2 seed competitions", () => {
    expect(getCompetitions().length).toBe(2);
  });

  it("adds a competition", () => {
    addCompetition("Nationals", "Swimming", "2024-09-01", "Main Pool");
    expect(getCompetitions().length).toBe(3);
  });

  it("rejects empty competition name", () => {
    expect(addCompetition("", "Swimming", "2024-09-01", "Pool")).toBeNull();
  });

  it("deletes a competition", () => {
    deleteCompetition("c1");
    expect(getCompetitions().length).toBe(1);
  });

  it("adds result to competition", () => {
    addResult("c1", "Charlie", 3, "61.0s", "");
    const c = getCompetitions().find((c) => c.id === "c1");
    expect(c!.results.length).toBe(3);
  });

  it("rejects result with zero place", () => {
    expect(addResult("c1", "Charlie", 0, "61.0s", "")).toBeNull();
  });

  it("rejects result with empty athlete name", () => {
    expect(addResult("c1", "", 1, "58.0s", "")).toBeNull();
  });
});
