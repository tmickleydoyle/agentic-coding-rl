import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getWorkouts, addWorkout } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Store API", () => {
  it("returns 3 seed workouts", () => {
    expect(getWorkouts().length).toBe(3);
  });

  it("adds a workout", () => {
    addWorkout("Cycling", "cardio", 60);
    expect(getWorkouts().length).toBe(4);
  });

  it("rejects empty name", () => {
    const result = addWorkout("", "cardio", 30);
    expect(result).toBeNull();
  });

  it("rejects zero duration", () => {
    const result = addWorkout("Run", "cardio", 0);
    expect(result).toBeNull();
  });

  it("rejects negative duration", () => {
    const result = addWorkout("Run", "cardio", -5);
    expect(result).toBeNull();
  });

  it("reset restores seed", () => {
    addWorkout("Extra", "strength", 10);
    __reset();
    expect(getWorkouts().length).toBe(3);
  });
});
