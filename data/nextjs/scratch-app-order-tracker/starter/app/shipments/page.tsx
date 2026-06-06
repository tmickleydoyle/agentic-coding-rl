'use client'
import React from 'react'
export function ShipmentsPage() {
  return (
    <div>
      <h1>Shipments</h1>
      <form data-testid="add-shipment-form">
        <select data-testid="select-shipment-order"><option value="">Select order</option></select>
        <input data-testid="input-shipment-carrier" placeholder="Carrier" />
        <input data-testid="input-shipment-tracking" placeholder="Tracking Number" />
        <input data-testid="input-shipment-delivery" type="date" />
        <button data-testid="btn-add-shipment" type="submit">Add Shipment</button>
      </form>
      <ul data-testid="shipment-list"></ul>
    </div>
  )
}
