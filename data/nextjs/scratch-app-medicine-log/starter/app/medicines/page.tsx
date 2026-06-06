'use client'
import React from 'react'
export function MedicinesPage() {
  return <div><h1>Medicines</h1>
    <ul data-testid="medicine-list"></ul>
    <form data-testid="add-medicine-form">
      <input data-testid="medicine-name-input" placeholder="Name"/>
      <input data-testid="medicine-dosage-input" placeholder="Dosage"/>
      <select data-testid="medicine-frequency-select"><option value="daily">daily</option><option value="twice daily">twice daily</option><option value="weekly">weekly</option></select>
      <input data-testid="medicine-notes-input" placeholder="Notes"/>
      <button data-testid="submit-medicine" type="submit">Add</button>
    </form>
  </div>
}
