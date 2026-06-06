import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { EventsPage } from '../reference/app/events/page'
import { GuestsPage } from '../reference/app/guests/page'
import { AgendaPage } from '../reference/app/agenda/page'
import { __reset } from '../reference/lib/store'

beforeEach(() => { __reset() })

describe('Events Page', () => {
  it('shows 2 seed events', async () => {
    render(<EventsPage />)
    await waitFor(() => expect(screen.getAllByTestId('event-item').length).toBe(2))
  })

  it('filters by party', async () => {
    render(<EventsPage />)
    await waitFor(() => screen.getAllByTestId('event-item'))
    fireEvent.change(screen.getByTestId('event-category-filter'), { target: { value: 'party' } })
    expect(screen.getAllByTestId('event-item').length).toBe(1)
  })

  it('adds a new event', async () => {
    render(<EventsPage />)
    await waitFor(() => screen.getAllByTestId('event-item'))
    fireEvent.change(screen.getByTestId('event-title-input'), { target: { value: 'Team Lunch' } })
    fireEvent.change(screen.getByTestId('event-date-input'), { target: { value: '2024-08-01' } })
    fireEvent.change(screen.getByTestId('event-location-input'), { target: { value: 'Cafeteria' } })
    fireEvent.click(screen.getByTestId('submit-event'))
    await waitFor(() => expect(screen.getAllByTestId('event-item').length).toBe(3))
  })

  it('deletes an event', async () => {
    render(<EventsPage />)
    await waitFor(() => screen.getAllByTestId('event-item'))
    fireEvent.click(screen.getAllByTestId('delete-event')[0])
    await waitFor(() => expect(screen.getAllByTestId('event-item').length).toBe(1))
  })
})

describe('Guests Page', () => {
  it('shows 3 seed guests', async () => {
    render(<GuestsPage />)
    await waitFor(() => expect(screen.getAllByTestId('guest-item').length).toBe(3))
  })
})

describe('Agenda Page', () => {
  it('shows agenda items', async () => {
    render(<AgendaPage />)
    await waitFor(() => expect(screen.getAllByTestId('agenda-item').length).toBe(2))
  })
})
