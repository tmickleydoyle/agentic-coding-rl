import React, { createContext, useContext, useState } from "react";
import { Meal, FoodItem, DailyTargets, MealTime, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  meals: Meal[];
  activeMealId: string | null;
  setActiveMealId: (id: string | null) => void;
  targets: DailyTargets;
  addMeal: (name: string, time: MealTime) => void;
  deleteMeal: (id: string) => void;
  addFood: (mealId: string, name: string, calories: number, protein: number, carbs: number, fat: number) => void;
  saveTargets: (t: DailyTargets) => void;
}

const Ctx = createContext<AppCtx>({
  route: "meals",
  setRoute: () => {},
  meals: [],
  activeMealId: null,
  setActiveMealId: () => {},
  targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 },
  addMeal: () => {},
  deleteMeal: () => {},
  addFood: () => {},
  saveTargets: () => {},
});

export function useApp() {
  return useContext(Ctx);
}

const SEED_MEALS: Meal[] = [
  {
    id: "m1",
    name: "Morning Bowl",
    time: "breakfast",
    foods: [{ id: "f1", name: "Oats", calories: 300, protein: 10, carbs: 55, fat: 6 }],
  },
  {
    id: "m2",
    name: "Lunch Wrap",
    time: "lunch",
    foods: [
      { id: "f2", name: "Chicken", calories: 250, protein: 30, carbs: 10, fat: 5 },
      { id: "f3", name: "Tortilla", calories: 150, protein: 4, carbs: 28, fat: 3 },
    ],
  },
];

let uid_m = 3;
let uid_f = 4;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("meals");
  const [meals, setMeals] = useState<Meal[]>(SEED_MEALS.map((m) => ({ ...m, foods: m.foods.map((f) => ({ ...f })) })));
  const [activeMealId, setActiveMealId] = useState<string | null>(null);
  const [targets, setTargetsState] = useState<DailyTargets>({ calories: 2000, protein: 150, carbs: 200, fat: 65 });

  function addMeal(name: string, time: MealTime) {
    if (!name.trim()) return;
    const m: Meal = { id: `m${uid_m++}`, name: name.trim(), time, foods: [] };
    setMeals((prev) => [...prev, m]);
  }

  function deleteMeal(id: string) {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    setActiveMealId((prev) => (prev === id ? null : prev));
  }

  function addFood(mealId: string, name: string, calories: number, protein: number, carbs: number, fat: number) {
    if (!name.trim() || calories < 0 || protein < 0 || carbs < 0 || fat < 0) return;
    const f: FoodItem = { id: `f${uid_f++}`, name: name.trim(), calories, protein, carbs, fat };
    setMeals((prev) => prev.map((m) => m.id === mealId ? { ...m, foods: [...m.foods, f] } : m));
  }

  function saveTargets(t: DailyTargets) {
    if (t.calories <= 0 || t.protein <= 0 || t.carbs <= 0 || t.fat <= 0) return;
    setTargetsState(t);
  }

  return (
    <Ctx.Provider value={{ route, setRoute, meals, activeMealId, setActiveMealId, targets, addMeal, deleteMeal, addFood, saveTargets }}>
      {children}
    </Ctx.Provider>
  );
}
