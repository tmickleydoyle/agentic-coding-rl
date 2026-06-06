'use client'
import React from 'react'

export function AttendeesPage() {
  return (
    <div>
      <h1>Attendees</h1>
      <form data-testid="add-attendee-form">
        <input data-testid="input-attendee-name" placeholder="Name" />
        <input data-testid="input-attendee-email" placeholder="Email" />
        <select data-testid="select-attendee-event"><option value="">Select event</option></select>
        <button data-testid="btn-add-attendee" type="submit">Add Attendee</button>
      </form>
      <ul data-testid="attendee-list"></ul>
    </div>
  )
}
