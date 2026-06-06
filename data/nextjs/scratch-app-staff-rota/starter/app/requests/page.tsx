'use client'
import React from 'react'

export function RequestsPage() {
  return (
    <div>
      <h1>Time-Off Requests</h1>
      <form data-testid="add-request-form">
        <select data-testid="select-request-staff"><option value="">Select staff</option></select>
        <input data-testid="input-request-start" type="date" />
        <input data-testid="input-request-end" type="date" />
        <input data-testid="input-request-reason" placeholder="Reason" />
        <button data-testid="btn-submit-request" type="submit">Submit Request</button>
      </form>
      <ul data-testid="request-list"></ul>
    </div>
  )
}
