'use client'
import React from 'react'

export function AppointmentsPage() {
  return (
    <div>
      <h1>Appointments</h1>
      <ul data-testid="appointment-list"></ul>
      <form data-testid="add-appointment-form">
        <select data-testid="appointment-patient-select"></select>
        <input data-testid="appointment-date-input" type="date" />
        <input data-testid="appointment-time-input" type="time" />
        <input data-testid="appointment-reason-input" placeholder="Reason" />
        <button data-testid="submit-appointment" type="submit">Add Appointment</button>
      </form>
    </div>
  )
}
