'use client'
import React from 'react';
export function PlannerPage() {
  return (
    <main data-testid="planner-page">
      <h2>Meal Planner</h2>
      <div data-testid="add-plan-form">
        <select data-testid="plan-day-select"><option value="Mon">Mon</option></select>
        <select data-testid="plan-mealtype-select"><option value="breakfast">breakfast</option></select>
        <select data-testid="plan-recipe-select"><option value="">-- Select Recipe --</option></select>
        <button data-testid="add-plan-btn">Add to Plan</button>
      </div>
      <ul data-testid="plan-list" />
    </main>
  );
}
