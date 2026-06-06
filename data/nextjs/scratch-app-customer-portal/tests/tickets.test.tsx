import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { __reset, getTickets } from '../lib/store'

beforeEach(() => { __reset() })

describe('Tickets feature', () => {
  it('displays seed tickets', async () => {
    const { TicketsPage } = await import('../app/tickets/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getTickets() }) as unknown as typeof fetch
    render(<TicketsPage />)
    await waitFor(() => {
      expect(screen.getAllByTestId('ticket-item').length).toBe(4)
    })
  })

  it('shows ticket subject', async () => {
    const { TicketsPage } = await import('../app/tickets/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getTickets() }) as unknown as typeof fetch
    render(<TicketsPage />)
    await waitFor(() => {
      expect(screen.getAllByTestId('ticket-subject')[0].textContent).toBe('Login issue')
    })
  })

  it('shows close button for open tickets', async () => {
    const { TicketsPage } = await import('../app/tickets/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => getTickets() }) as unknown as typeof fetch
    render(<TicketsPage />)
    await waitFor(() => {
      expect(screen.getAllByTestId('btn-close-ticket').length).toBeGreaterThan(0)
    })
  })

  it('add ticket form has required fields', async () => {
    const { TicketsPage } = await import('../app/tickets/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<TicketsPage />)
    expect(screen.getByTestId('input-ticket-subject')).toBeTruthy()
    expect(screen.getByTestId('select-ticket-priority')).toBeTruthy()
    expect(screen.getByTestId('btn-add-ticket')).toBeTruthy()
  })

  it('submits new ticket', async () => {
    const { TicketsPage } = await import('../app/tickets/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<TicketsPage />)
    fireEvent.change(screen.getByTestId('input-ticket-subject'), { target: { value: 'Test issue' } })
    fireEvent.click(screen.getByTestId('btn-add-ticket'))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/tickets', expect.objectContaining({ method: 'POST' }))
    })
  })
})
