'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Habit } from '../../lib/types'

export function HabitsPage() {
  const { habits, setHabits } = useApp()
  const [name, setName] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [category, setCategory] = useState('')

  const handleAdd = () => {
    if (!name) return
    const h: Habit = { id: `h${Date.now()}`, name, frequency, category }
    setHabits([...habits, h])
    setName(''); setCategory('')
  }

  return (
    <div data-testid="habits-page">
      <h1>Habits</h1>
      <input data-testid="input-habit-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <select data-testid="input-habit-frequency" value={frequency} onChange={e => setFrequency(e.target.value as 'daily' | 'weekly')}>
        <option value="daily">daily</option>
        <option value="weekly">weekly</option>
      </select>
      <input data-testid="input-habit-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
      <button data-testid="add-habit-btn" onClick={handleAdd}>Add Habit</button>
      {habits.map(h => (
        <div key={h.id} data-testid={`habit-item-${h.id}`}>
          <span>{h.name}</span>
          <span>{h.frequency}</span>
          <span>{h.category}</span>
        </div>
      ))}
    </div>
  )
}
