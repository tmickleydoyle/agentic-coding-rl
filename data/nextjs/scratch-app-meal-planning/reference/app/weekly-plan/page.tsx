import React from "react";
import { useApp } from "../../components/AppStateProvider";
import { MealEntry, DayOfWeek } from "../../lib/types";

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function WeeklyPlanPage() {
  const { meals, navigate } = useApp();
  return (
    <div>
      <h1>Weekly Meal Plan</h1>
      <p data-testid="total-meals">{meals.length} meals planned</p>
      {DAYS.map((day) => {
        const dayMeals = meals.filter((m: MealEntry) => m.day === day);
        return (
          <div key={day} data-testid={`day-section-${day}`}>
            <h2>{day}</h2>
            {dayMeals.map((m: MealEntry) => (
              <div
                key={m.id}
                data-testid="meal-entry"
                onClick={() => navigate("meal-detail", m)}
                style={{ cursor: "pointer" }}
              >
                {m.mealType}: {m.name}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
