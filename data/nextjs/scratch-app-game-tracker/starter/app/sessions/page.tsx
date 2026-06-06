'use client'
import React from 'react'
export function SessionsPage() { return <div><h1>Sessions</h1><ul data-testid="session-list"></ul><form data-testid="add-session-form"><select data-testid="session-game-select"></select><input data-testid="session-date-input" type="date"/><input data-testid="session-duration-input" type="number"/><input data-testid="session-notes-input" placeholder="Notes"/><button data-testid="submit-session" type="submit">Add</button></form></div> }
