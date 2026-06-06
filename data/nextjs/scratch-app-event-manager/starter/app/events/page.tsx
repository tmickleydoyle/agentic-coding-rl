'use client'
import React from 'react'

export function EventsPage() {
  return (
    <div>
      <h1>Events</h1>
      <form data-testid="add-event-form">
        <input data-testid="input-event-name" placeholder="Event Name" />
        <input data-testid="input-event-date" type="date" />
        <input data-testid="input-event-venue" placeholder="Venue" />
        <input data-testid="input-event-capacity" type="number" placeholder="Capacity" />
        <button data-testid="btn-add-event" type="submit">Add Event</button>
      </form>
      <ul data-testid="event-list"></ul>
    </div>
  )
}
