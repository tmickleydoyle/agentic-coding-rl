'use client'
import React from 'react'
export function ReturnsPage() {
  return (
    <div>
      <h1>Returns</h1>
      <form data-testid="add-return-form">
        <select data-testid="select-return-order"><option value="">Select order</option></select>
        <input data-testid="input-return-reason" placeholder="Reason" />
        <button data-testid="btn-add-return" type="submit">Submit Return</button>
      </form>
      <ul data-testid="return-list"></ul>
    </div>
  )
}
