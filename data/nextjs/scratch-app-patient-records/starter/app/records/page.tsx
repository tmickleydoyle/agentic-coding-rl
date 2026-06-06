'use client'
import React from 'react'

export function RecordsPage() {
  return (
    <div>
      <h1>Medical Records</h1>
      <ul data-testid="record-list"></ul>
      <form data-testid="add-record-form">
        <select data-testid="record-patient-select"></select>
        <input data-testid="record-date-input" type="date" />
        <input data-testid="record-diagnosis-input" placeholder="Diagnosis" />
        <textarea data-testid="record-notes-input" placeholder="Notes (optional)" />
        <button data-testid="submit-record" type="submit">Add Record</button>
      </form>
    </div>
  )
}
