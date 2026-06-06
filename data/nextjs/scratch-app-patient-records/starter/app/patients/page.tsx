'use client'
import React from 'react'

export function PatientsPage() {
  return (
    <div>
      <h1>Patients</h1>
      <input data-testid="patient-search" placeholder="Search by name..." />
      <ul data-testid="patient-list"></ul>
      <form data-testid="add-patient-form">
        <input data-testid="patient-name-input" placeholder="Name" />
        <input data-testid="patient-dob-input" type="date" />
        <select data-testid="patient-gender-select">
          <option>Male</option><option>Female</option><option>Other</option>
        </select>
        <input data-testid="patient-phone-input" placeholder="Phone" />
        <button data-testid="submit-patient" type="submit">Add Patient</button>
      </form>
    </div>
  )
}
