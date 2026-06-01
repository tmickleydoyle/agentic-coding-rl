'use client'
import { useState } from 'react'

type Exercise = {
  id: number
  name: string
  sets: number
  reps: number
  weight: number
}

export default function App() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [name, setName] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [nextId, setNextId] = useState(1)

  function add() {
    const trimmedName = name.trim()
    const setsNum = Number(sets)
    const repsNum = Number(reps)
    const weightNum = Number(weight)
    if (
      !trimmedName ||
      !sets || setsNum <= 0 ||
      !reps || repsNum <= 0 ||
      !weight || weightNum <= 0
    ) return

    setExercises((prev) => [
      ...prev,
      { id: nextId, name: trimmedName, sets: setsNum, reps: repsNum, weight: weightNum },
    ])
    setNextId((n) => n + 1)
    setName('')
    setSets('')
    setReps('')
    setWeight('')
  }

  function remove(id: number) {
    setExercises((prev) => prev.filter((e) => e.id !== id))
  }

  const totalVolume = exercises.reduce((acc, e) => acc + e.sets * e.reps * e.weight, 0)

  return (
    <div>
      <h1>Workout Log</h1>
      <div>
        <input
          aria-label="Exercise name"
          placeholder="Exercise name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Sets"
          type="number"
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />
        <input
          aria-label="Reps"
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <input
          aria-label="Weight (kg)"
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <button onClick={add}>Add exercise</button>
      </div>
      <ul>
        {exercises.map((e) => {
          const vol = e.sets * e.reps * e.weight
          return (
            <li key={e.id}>
              <span>{e.name}</span>
              <span>{`${e.sets} x ${e.reps} x ${e.weight} kg`}</span>
              <span>{`Volume: ${vol} kg`}</span>
              <button onClick={() => remove(e.id)}>Remove</button>
            </li>
          )
        })}
      </ul>
      <div>
        <p>{`Total exercises: ${exercises.length}`}</p>
        <p>{`Total session volume: ${totalVolume} kg`}</p>
      </div>
    </div>
  )
}
