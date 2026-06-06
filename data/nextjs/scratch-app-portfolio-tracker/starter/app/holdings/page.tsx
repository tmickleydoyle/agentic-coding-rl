'use client'
import React from 'react'
export function HoldingsPage() { return <div><h1>Holdings</h1><ul data-testid="holding-list"></ul><form data-testid="add-holding-form"><input data-testid="holding-symbol-input"/><input data-testid="holding-name-input"/><input data-testid="holding-quantity-input" type="number"/><input data-testid="holding-purchase-price-input" type="number"/><input data-testid="holding-current-price-input" type="number"/><button data-testid="submit-holding" type="submit">Add</button></form></div> }
