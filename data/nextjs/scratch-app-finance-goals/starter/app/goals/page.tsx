'use client'
import React from 'react'

export function GoalsPage() {
  return (
    <div data-testid="goals-page">
      <h1>Goals</h1>
      <input data-testid="input-name" placeholder="Name" />
      <input data-testid="input-target" placeholder="Target Amount" type="number" />
      <input data-testid="input-current" placeholder="Current Amount" type="number" />
      <input data-testid="input-deadline" placeholder="Deadline YYYY-MM-DD" />
      <input data-testid="input-category" placeholder="Category" />
      <button data-testid="add-goal-btn">Add Goal</button>
    </div>
  )
}
