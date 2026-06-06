'use client'
import React from 'react'
export function EventsPage() { return <div><h1>Events</h1><select data-testid="event-category-filter"><option value="all">all</option></select><ul data-testid="event-list"></ul><form data-testid="add-event-form"><input data-testid="event-title-input" placeholder="Title"/><input data-testid="event-date-input" type="date"/><input data-testid="event-location-input" placeholder="Location"/><select data-testid="event-category-select"><option value="other">other</option></select><button data-testid="submit-event" type="submit">Add</button></form></div> }
