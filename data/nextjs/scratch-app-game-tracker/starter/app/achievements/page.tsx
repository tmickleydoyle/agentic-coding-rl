'use client'
import React from 'react'
export function AchievementsPage() { return <div><h1>Achievements</h1><ul data-testid="achievement-list"></ul><form data-testid="add-achievement-form"><select data-testid="achievement-game-select"></select><input data-testid="achievement-name-input" placeholder="Name"/><input data-testid="achievement-description-input" placeholder="Description"/><input data-testid="achievement-date-input" type="date"/><button data-testid="submit-achievement" type="submit">Add</button></form></div> }
