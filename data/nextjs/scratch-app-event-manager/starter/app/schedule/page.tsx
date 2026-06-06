'use client'
import React from 'react'

export function SchedulePage() {
  return (
    <div>
      <h1>Schedule</h1>
      <form data-testid="add-session-form">
        <input data-testid="input-session-title" placeholder="Session Title" />
        <select data-testid="select-session-event"><option value="">Select event</option></select>
        <input data-testid="input-session-start" type="time" />
        <input data-testid="input-session-end" type="time" />
        <input data-testid="input-session-speaker" placeholder="Speaker" />
        <button data-testid="btn-add-session" type="submit">Add Session</button>
      </form>
      <ul data-testid="session-list"></ul>
    </div>
  )
}
