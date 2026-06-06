'use client'
import React from 'react'
export function GuestsPage() { return <div><h1>Guests</h1><ul data-testid="guest-list"></ul><form data-testid="add-guest-form"><input data-testid="guest-name-input" placeholder="Name"/><input data-testid="guest-email-input" placeholder="Email"/><select data-testid="guest-event-select"></select><select data-testid="guest-rsvp-select"><option value="pending">pending</option></select><button data-testid="submit-guest" type="submit">Add</button></form></div> }
