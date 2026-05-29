'use client'
import { useState } from 'react'

export default function TodoList() {
  // TODO: implement add/remove with a controlled input. See description.md for the
  // exact data-testids, button labels, and empty-input behavior.
  return (
    <div>
      <input type="text" data-testid="todo-input" />
      <button data-testid="add-btn">Add</button>
      <ul data-testid="todo-list"></ul>
    </div>
  )
}
