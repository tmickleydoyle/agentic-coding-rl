import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getEvents, addEvent, getAttendees, addAttendee, getSessions, addSession } from '../lib/store'

beforeEach(() => { __reset() })

describe('Store API', () => {
  it('getEvents returns 4 seed events', () => {
    expect(getEvents().length).toBe(4)
  })

  it('addEvent sets status to upcoming', () => {
    addEvent({ name: 'X', date: '2025-01-01', venue: 'V', capacity: 50 })
    const evs = getEvents()
    expect(evs[evs.length - 1].status).toBe('upcoming')
  })

  it('getAttendees returns 5 seed attendees', () => {
    expect(getAttendees().length).toBe(5)
  })

  it('addAttendee increments list', () => {
    addAttendee({ name: 'New', email: 'n@n.com', eventId: 'ev1' })
    expect(getAttendees().length).toBe(6)
  })

  it('getSessions returns 3 seed sessions', () => {
    expect(getSessions().length).toBe(3)
  })

  it('addSession increments list', () => {
    addSession({ title: 'T', eventId: 'ev1', startTime: '08:00', endTime: '09:00', speaker: 'S' })
    expect(getSessions().length).toBe(4)
  })

  it('__reset restores seed state', () => {
    addEvent({ name: 'X', date: '2025-01-01', venue: 'V', capacity: 50 })
    __reset()
    expect(getEvents().length).toBe(4)
  })
})
