import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getAthletes, getSessions, addAthlete, addSession, addDrill } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Store API", () => {
  it("returns 2 seed athletes", () => {
    expect(getAthletes().length).toBe(2);
  });

  it("returns 2 seed sessions", () => {
    expect(getSessions().length).toBe(2);
  });

  it("adds athlete", () => {
    addAthlete("Tom", "Cycling", "beginner");
    expect(getAthletes().length).toBe(3);
  });

  it("rejects empty athlete name", () => {
    expect(addAthlete("", "Cycling", "beginner")).toBeNull();
  });

  it("adds session", () => {
    addSession("a1", "2024-05-05", 75, "Endurance");
    expect(getSessions().length).toBe(3);
  });

  it("rejects zero duration session", () => {
    expect(addSession("a1", "2024-05-05", 0, "Endurance")).toBeNull();
  });

  it("adds drill", () => {
    addDrill("s1", "Kick Drill", 8, "");
    const s = getSessions().find((s) => s.id === "s1");
    expect(s!.drills.length).toBe(2);
  });
});
