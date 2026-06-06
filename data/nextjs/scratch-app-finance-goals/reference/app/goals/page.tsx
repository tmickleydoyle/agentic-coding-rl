'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Goal } from '../../lib/types'

export function GoalsPage() {
  const { goals, setGoals } = useApp()
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [category, setCategory] = useState('')

  const handleAdd = () => {
    if (!name || !targetAmount || !deadline || !category) return
    const newGoal: Goal = {
      id: `g${Date.now()}`,
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline,
      category,
    }
    setGoals([...goals, newGoal])
    setName(''); setTargetAmount(''); setCurrentAmount(''); setDeadline(''); setCategory('')
  }

  return (
    <div data-testid="goals-page">
      <h1>Goals</h1>
      <div>
        <input data-testid="input-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <input data-testid="input-target" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="Target Amount" type="number" />
        <input data-testid="input-current" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} placeholder="Current Amount" type="number" />
        <input data-testid="input-deadline" value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="Deadline YYYY-MM-DD" />
        <input data-testid="input-category" value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
        <button data-testid="add-goal-btn" onClick={handleAdd}>Add Goal</button>
      </div>
      {goals.map(g => {
        const pct = Math.min(100, (g.currentAmount / g.targetAmount) * 100)
        return (
          <div key={g.id} data-testid={`goal-card-${g.id}`} className="goal-card">
            <div>{g.name}</div>
            <div>Target: {g.targetAmount}</div>
            <div>Current: {g.currentAmount}</div>
            <div>Deadline: {g.deadline}</div>
            <div>Category: {g.category}</div>
            <div data-testid={`goal-progress-${g.id}`} style={{ width: `${pct}%` }} role="progressbar" aria-valuenow={pct}>
              {pct.toFixed(0)}%
            </div>
          </div>
        )
      })}
    </div>
  )
}
