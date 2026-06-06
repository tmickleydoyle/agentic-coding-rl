'use client'
import React from 'react'
export function HabitsPage() {
  return <div data-testid="habits-page"><h1>Habits</h1>
    <input data-testid="input-habit-name" placeholder="Name" />
    <select data-testid="input-habit-frequency"><option value="daily">daily</option><option value="weekly">weekly</option></select>
    <input data-testid="input-habit-category" placeholder="Category" />
    <button data-testid="add-habit-btn">Add Habit</button>
  </div>
}
