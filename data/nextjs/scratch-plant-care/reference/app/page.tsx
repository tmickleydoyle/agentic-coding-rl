'use client'
import { useState } from 'react'

interface Plant {
  id: number
  name: string
  species: string
  location: string
}

interface CareEvent {
  id: number
  plantId: number
  type: string
  date: string
  notes: string
}

const PLANTS: Plant[] = [
  { id: 1, name: 'Monstera', species: 'Monstera deliciosa', location: 'Living Room' },
  { id: 2, name: 'Pothos', species: 'Epipremnum aureum', location: 'Kitchen' },
  { id: 3, name: 'Snake Plant', species: 'Sansevieria trifasciata', location: 'Bedroom' },
]

const CARE_EVENTS: CareEvent[] = [
  { id: 1, plantId: 1, type: 'water', date: '2024-01-10', notes: 'Soil was dry' },
  { id: 2, plantId: 2, type: 'fertilize', date: '2024-01-08', notes: 'Monthly feed' },
  { id: 3, plantId: 3, type: 'prune', date: '2024-01-05', notes: 'Removed dead leaves' },
]

let nextEventId = 4

export default function App() {
  const [plants] = useState<Plant[]>(PLANTS.map(p => ({ ...p })))
  const [events, setEvents] = useState<CareEvent[]>(CARE_EVENTS.map(e => ({ ...e })))
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null)
  const [careType, setCareType] = useState('water')
  const [careDate, setCareDate] = useState('')
  const [careNotes, setCareNotes] = useState('')

  const selectedPlant = plants.find(p => p.id === selectedPlantId) ?? null

  const plantEvents = selectedPlantId !== null
    ? events
        .filter(e => e.plantId === selectedPlantId)
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
    : []

  function getEventCount(plantId: number): number {
    return events.filter(e => e.plantId === plantId).length
  }

  function handleSelectPlant(id: number) {
    setSelectedPlantId(id)
    setCareType('water')
    setCareDate('')
    setCareNotes('')
  }

  function handleLogCare(e: React.FormEvent) {
    e.preventDefault()
    if (!careDate || selectedPlantId === null) return
    const newEvent: CareEvent = {
      id: nextEventId++,
      plantId: selectedPlantId,
      type: careType,
      date: careDate,
      notes: careNotes,
    }
    setEvents(prev => [...prev, newEvent])
    setCareType('water')
    setCareDate('')
    setCareNotes('')
  }

  function handleDeleteEvent(id: number) {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div>
      <h1>Plant Care Tracker</h1>

      <section>
        <h2>Plants</h2>
        {plants.map(plant => (
          <div key={plant.id} data-testid={`plant-row-${plant.id}`}>
            <span>{plant.name}</span>
            <span data-testid={`plant-event-count-${plant.id}`}>({getEventCount(plant.id)} events)</span>
            <span>{plant.species}</span>
            <span>{plant.location}</span>
            <button
              data-testid={`select-plant-${plant.id}`}
              onClick={() => handleSelectPlant(plant.id)}
            >
              Select
            </button>
          </div>
        ))}
      </section>

      {selectedPlant !== null && (
        <>
          <section data-testid="selected-plant">
            <h2>Selected Plant</h2>
            <p>{selectedPlant.name}</p>
            <p>{selectedPlant.species}</p>
            <p>{selectedPlant.location}</p>
          </section>

          <form data-testid="care-form" onSubmit={handleLogCare}>
            <h2>Log Care Event</h2>
            <select
              data-testid="care-type-select"
              value={careType}
              onChange={e => setCareType(e.target.value)}
            >
              <option value="water">water</option>
              <option value="fertilize">fertilize</option>
              <option value="prune">prune</option>
            </select>
            <input
              type="date"
              data-testid="care-date-input"
              value={careDate}
              onChange={e => setCareDate(e.target.value)}
            />
            <textarea
              data-testid="care-notes-input"
              value={careNotes}
              onChange={e => setCareNotes(e.target.value)}
              placeholder="Notes (optional)"
            />
            <button type="submit" data-testid="log-care-btn">Log Care Event</button>
          </form>

          <section>
            <h2>Care History</h2>
            <div data-testid="care-history">
              {plantEvents.length === 0 ? (
                <p data-testid="no-events-msg">No care events yet</p>
              ) : (
                plantEvents.map(event => (
                  <div key={event.id} data-testid={`care-event-${event.id}`}>
                    <span>{event.type}</span>
                    <span>{event.date}</span>
                    <span>{event.notes}</span>
                    <button
                      data-testid={`delete-event-${event.id}`}
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
