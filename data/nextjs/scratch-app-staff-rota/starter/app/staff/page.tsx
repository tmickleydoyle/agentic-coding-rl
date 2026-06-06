'use client'
import React from 'react'

export function StaffPage() {
  return (
    <div>
      <h1>Staff</h1>
      <form data-testid="add-staff-form">
        <input data-testid="input-staff-name" placeholder="Name" />
        <input data-testid="input-staff-email" placeholder="Email" />
        <input data-testid="input-staff-role" placeholder="Role" />
        <input data-testid="input-staff-department" placeholder="Department" />
        <button data-testid="btn-add-staff" type="submit">Add Staff</button>
      </form>
      <ul data-testid="staff-list"></ul>
    </div>
  )
}
