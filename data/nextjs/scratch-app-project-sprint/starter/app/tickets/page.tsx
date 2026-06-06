'use client'
import React from 'react'
export function TicketsPage() { return <div><h1>Tickets</h1><select data-testid="ticket-status-filter"><option value="all">all</option></select><ul data-testid="ticket-list"></ul><form data-testid="add-ticket-form"><input data-testid="ticket-title-input" placeholder="Title"/><select data-testid="ticket-sprint-select"></select><select data-testid="ticket-assignee-select"></select><select data-testid="ticket-priority-select"><option value="medium">medium</option></select><button data-testid="submit-ticket" type="submit">Add</button></form></div> }
