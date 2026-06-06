'use client'
import React from 'react'

export function TicketsPage() {
  return (
    <div>
      <h1>Support Tickets</h1>
      <form data-testid="add-ticket-form">
        <input data-testid="input-ticket-subject" placeholder="Subject" />
        <select data-testid="select-ticket-priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        <button data-testid="btn-add-ticket" type="submit">Add Ticket</button>
      </form>
      <ul data-testid="ticket-list"></ul>
    </div>
  )
}
