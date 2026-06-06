'use client'
import React from 'react'
export function LocationsPage() {
  return (
    <div>
      <h1>Locations</h1>
      <form data-testid="add-location-form">
        <input data-testid="input-location-code" placeholder="Code" />
        <input data-testid="input-location-zone" placeholder="Zone" />
        <input data-testid="input-location-capacity" type="number" placeholder="Capacity" />
        <button data-testid="btn-add-location" type="submit">Add Location</button>
      </form>
      <ul data-testid="location-list"></ul>
    </div>
  )
}
