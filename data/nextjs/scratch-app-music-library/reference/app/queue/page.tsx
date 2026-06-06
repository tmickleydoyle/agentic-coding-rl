'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
export function QueuePage() {
  const { tracks, queue, setQueue } = useApp()
  const remove = (id: string) => setQueue(queue.filter(q => q.id !== id))
  return (
    <div data-testid="queue-page">
      <h1>Queue</h1>
      {queue.map(q => {
        const track = tracks.find(t => t.id === q.trackId)
        return (
          <div key={q.id} data-testid={`queue-item-${q.id}`}>
            <span>{track?.title ?? q.trackId}</span>
            <button data-testid={`remove-queue-${q.id}`} onClick={() => remove(q.id)}>Remove</button>
          </div>
        )
      })}
    </div>
  )
}
