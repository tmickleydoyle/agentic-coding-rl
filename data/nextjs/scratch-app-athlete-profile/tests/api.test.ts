import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getMetrics, addMetric, getEvents, addEvent, deleteEvent, getAchievements, addAchievement } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Store API", () => {
  it("returns 2 seed metrics", () => {
    expect(getMetrics().length).toBe(2);
  });

  it("adds a metric", () => {
    addMetric("2024-07-01", 70.5, 178, 62);
    expect(getMetrics().length).toBe(3);
  });

  it("rejects zero weight metric", () => {
    expect(addMetric("2024-07-01", 0, 178, 62)).toBeNull();
  });

  it("returns 2 seed events", () => {
    expect(getEvents().length).toBe(2);
  });

  it("deletes an event", () => {
    deleteEvent("e1");
    expect(getEvents().length).toBe(1);
  });

  it("returns seed achievement", () => {
    expect(getAchievements().length).toBe(1);
  });

  it("adds achievement", () => {
    addAchievement("First Place", "2024-09-01", "Won the sprint");
    expect(getAchievements().length).toBe(2);
  });
});
