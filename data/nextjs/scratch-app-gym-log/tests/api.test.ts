import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getSessions, addSession, addExercise } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Store API", () => {
  it("returns 2 seed sessions", () => {
    expect(getSessions().length).toBe(2);
  });

  it("adds a session", () => {
    addSession("Leg Day", "2024-01-20");
    expect(getSessions().length).toBe(3);
  });

  it("rejects empty session name", () => {
    const result = addSession("", "2024-01-20");
    expect(result).toBeNull();
  });

  it("adds exercise to session", () => {
    addExercise("s1", "Squat", 3, 10, 80);
    const s = getSessions().find((s) => s.id === "s1");
    expect(s!.exercises.length).toBe(2);
  });

  it("rejects exercise with zero sets", () => {
    const result = addExercise("s1", "Squat", 0, 10, 80);
    expect(result).toBeNull();
  });

  it("resets to seed", () => {
    addSession("Extra", "2024-01-21");
    __reset();
    expect(getSessions().length).toBe(2);
  });
});
