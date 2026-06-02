'use client'
import { useState } from 'react'
import { useApp } from '../hooks/useApp'

export function Board() {
  const { tasks, addTask, startTask, finishTask, clearDone, hideDone } = useApp()
  const [name, setName] = useState('')
  const [points, setPoints] = useState(1)

  const todoTasks = tasks.filter((t) => t.status === 'todo')
  const doingTasks = tasks.filter((t) => t.status === 'doing')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  const sum = (arr: typeof tasks) => arr.reduce((acc, t) => acc + t.points, 0)

  const visibleTasks = hideDone ? tasks.filter((t) => t.status !== 'done') : tasks

  return (
    <section aria-label="Board view">
      <h1>Board</h1>
      <div>
        <input
          aria-label="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          aria-label="Points"
          type="number"
          value={points}
          min={1}
          onChange={(e) => setPoints(Number(e.target.value))}
        />
        <button
          onClick={() => {
            addTask(name, points)
            setName('')
            setPoints(1)
          }}
        >
          Add task
        </button>
      </div>
      <ul>
        {visibleTasks.map((t) => (
          <li key={t.id}>
            <span>{t.name}</span>
            <span>{`${t.points} pts`}</span>
            <span>{t.status}</span>
            <button
              aria-label={`Start ${t.name}`}
              disabled={t.status !== 'todo'}
              onClick={() => startTask(t.id)}
            >
              Start
            </button>
            <button
              aria-label={`Finish ${t.name}`}
              disabled={t.status !== 'doing'}
              onClick={() => finishTask(t.id)}
            >
              Finish
            </button>
          </li>
        ))}
      </ul>
      <p>{`To Do: ${todoTasks.length} tasks, ${sum(todoTasks)} pts`}</p>
      <p>{`Doing: ${doingTasks.length} tasks, ${sum(doingTasks)} pts`}</p>
      <p>{`Done: ${doneTasks.length} tasks, ${sum(doneTasks)} pts`}</p>
      <button onClick={clearDone}>Clear done</button>
    </section>
  )
}
