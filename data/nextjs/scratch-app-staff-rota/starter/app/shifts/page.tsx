'use client'
import React from 'react'

export function ShiftsPage() {
  return (
    <div>
      <h1>Shifts</h1>
      <form data-testid="add-shift-form">
        <select data-testid="select-shift-staff"><option value="">Select staff</option></select>
        <input data-testid="input-shift-date" type="date" />
        <input data-testid="input-shift-start" type="time" />
        <input data-testid="input-shift-end" type="time" />
        <input data-testid="input-shift-role" placeholder="Role" />
        <button data-testid="btn-add-shift" type="submit">Add Shift</button>
      </form>
      <ul data-testid="shift-list"></ul>
    </div>
  )
}
