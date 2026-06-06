import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getRuns, addRun, deleteRun, toggleRun } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Store API", () => {
  it("returns 3 seed runs", () => {
    expect(getRuns().length).toBe(3);
  });

  it("adds a run", () => {
    addRun("easy", 10, "2024-07-10");
    expect(getRuns().length).toBe(4);
  });

  it("rejects zero distance", () => {
    expect(addRun("easy", 0, "2024-07-10")).toBeNull();
  });

  it("rejects empty date", () => {
    expect(addRun("easy", 10, "")).toBeNull();
  });

  it("deletes a run", () => {
    deleteRun("r1");
    expect(getRuns().length).toBe(2);
  });

  it("toggles completed", () => {
    toggleRun("r1");
    expect(getRuns().find((r) => r.id === "r1")!.completed).toBe(true);
  });
});
