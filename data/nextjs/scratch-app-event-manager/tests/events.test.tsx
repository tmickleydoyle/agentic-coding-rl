import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { __reset, getEvents } from '../lib/store'

beforeEach(() => { __reset() })

describe('Events feature', () => {
  it('displays seed events', async () => {
    const { EventsPage } = await import('../app/events/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getEvents() }) as unknown as typeof fetch
    render(<EventsPage />)
    await waitFor(() => {
      expect(screen.getAllByTestId('event-item').length).toBe(4)
    })
  })

  it('shows event name', async () => {
    const { EventsPage } = await import('../app/events/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getEvents() }) as unknown as typeof fetch
    render(<EventsPage />)
    await waitFor(() => {
      expect(screen.getAllByTestId('event-name')[0].textContent).toBe('Tech Summit 2024')
    })
  })

  it('shows event status', async () => {
    const { EventsPage } = await import('../app/events/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getEvents() }) as unknown as typeof fetch
    render(<EventsPage />)
    await waitFor(() => {
      const statuses = screen.getAllByTestId('event-status')
      expect(statuses[0].textContent).toBe('upcoming')
    })
  })

  it('shows completed status for past event', async () => {
    const { EventsPage } = await import('../app/events/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getEvents() }) as unknown as typeof fetch
    render(<EventsPage />)
    await waitFor(() => {
      const statuses = screen.getAllByTestId('event-status')
      expect(statuses[1].textContent).toBe('completed')
    })
  })

  it('add event form fields exist', async () => {
    const { EventsPage } = await import('../app/events/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<EventsPage />)
    expect(screen.getByTestId('input-event-name')).toBeTruthy()
    expect(screen.getByTestId('input-event-date')).toBeTruthy()
    expect(screen.getByTestId('input-event-venue')).toBeTruthy()
    expect(screen.getByTestId('input-event-capacity')).toBeTruthy()
    expect(screen.getByTestId('btn-add-event')).toBeTruthy()
  })

  it('submits new event', async () => {
    const { EventsPage } = await import('../app/events/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<EventsPage />)
    fireEvent.change(screen.getByTestId('input-event-name'), { target: { value: 'New Event' } })
    fireEvent.change(screen.getByTestId('input-event-date'), { target: { value: '2024-12-01' } })
    fireEvent.change(screen.getByTestId('input-event-venue'), { target: { value: 'Hall B' } })
    fireEvent.change(screen.getByTestId('input-event-capacity'), { target: { value: '200' } })
    fireEvent.click(screen.getByTestId('btn-add-event'))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/events', expect.objectContaining({ method: 'POST' }))
    })
  })
})
