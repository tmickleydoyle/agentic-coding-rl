'use client'
import { useState } from 'react'

export default function BadgeCount() {
  return (
    <div>
      <button data-testid="add-btn">Add</button>
      <button data-testid="clear-btn">Clear</button>
    </div>
  )
}
