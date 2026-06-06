'use client'
import React from 'react'
export function SprintsPage() { return <div><h1>Sprints</h1><ul data-testid="sprint-list"></ul><form data-testid="add-sprint-form"><input data-testid="sprint-name-input" placeholder="Name"/><input data-testid="sprint-start-input" type="date"/><input data-testid="sprint-end-input" type="date"/><button data-testid="submit-sprint" type="submit">Add</button></form></div> }
