import { describe, it, expect, beforeEach } from "vitest";
import { __reset, getMeals, addMeal, addFood, setTargets, getTargets } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Store API", () => {
  it("returns 2 seed meals", () => {
    expect(getMeals().length).toBe(2);
  });

  it("adds a meal", () => {
    addMeal("Dinner", "dinner");
    expect(getMeals().length).toBe(3);
  });

  it("rejects empty meal name", () => {
    expect(addMeal("", "breakfast")).toBeNull();
  });

  it("adds food to meal", () => {
    addFood("m1", "Banana", 90, 1, 23, 0);
    const m = getMeals().find((m) => m.id === "m1");
    expect(m!.foods.length).toBe(2);
  });

  it("updates targets", () => {
    setTargets({ calories: 2500, protein: 180, carbs: 250, fat: 80 });
    expect(getTargets().calories).toBe(2500);
  });

  it("rejects zero calorie target", () => {
    setTargets({ calories: 0, protein: 150, carbs: 200, fat: 65 });
    expect(getTargets().calories).toBe(2000);
  });
});
