'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Habit } from '../../lib/types'

export function HabitsPage() {
  const { habits, setHabits } = useApp()
  const [name, setName] = useState('')
  const [color, setColor] = useState('')

  const handleAdd = () => {
    if (!name) return
    const h: Habit = { id: `h${Date.now()}`, name, color }
    setHabits([...habits, h])
    setName(''); setColor('')
  }

  return (
    <div data-testid="habits-page">
      <h1>Habits</h1>
      <input data-testid="input-habit-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input data-testid="input-habit-color" value={color} onChange={e => setColor(e.target.value)} placeholder="Color" />
      <button data-testid="add-habit-btn" onClick={handleAdd}>Add Habit</button>
      {habits.map(h => (
        <div key={h.id} data-testid={`habit-card-${h.id}`} style={{ color: h.color }}>
          <span>{h.name}</span>
          <span>{h.color}</span>
        </div>
      ))}
    </div>
  )
}
