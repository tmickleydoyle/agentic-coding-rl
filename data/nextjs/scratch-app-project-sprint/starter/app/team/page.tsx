'use client'
import React from 'react'
export function TeamPage() { return <div><h1>Team</h1><ul data-testid="team-list"></ul><form data-testid="add-team-form"><input data-testid="team-name-input" placeholder="Name"/><input data-testid="team-role-input" placeholder="Role"/><input data-testid="team-email-input" placeholder="Email"/><button data-testid="submit-team" type="submit">Add</button></form></div> }
