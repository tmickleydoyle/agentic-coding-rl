import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { SprintsPage } from '../reference/app/sprints/page'
import { TicketsPage } from '../reference/app/tickets/page'
import { TeamPage } from '../reference/app/team/page'
import { __reset } from '../reference/lib/store'

beforeEach(() => { __reset() })

describe('Sprints Page', () => {
  it('shows 2 seed sprints', async () => {
    render(<SprintsPage />)
    await waitFor(() => expect(screen.getAllByTestId('sprint-item').length).toBe(2))
  })

  it('adds a new sprint', async () => {
    render(<SprintsPage />)
    await waitFor(() => screen.getAllByTestId('sprint-item'))
    fireEvent.change(screen.getByTestId('sprint-name-input'), { target: { value: 'Sprint 3' } })
    fireEvent.change(screen.getByTestId('sprint-start-input'), { target: { value: '2024-07-01' } })
    fireEvent.change(screen.getByTestId('sprint-end-input'), { target: { value: '2024-07-14' } })
    fireEvent.click(screen.getByTestId('submit-sprint'))
    await waitFor(() => expect(screen.getAllByTestId('sprint-item').length).toBe(3))
  })

  it('marks sprint active', async () => {
    render(<SprintsPage />)
    await waitFor(() => screen.getAllByTestId('sprint-item'))
    fireEvent.click(screen.getByTestId('start-sprint'))
    await waitFor(() => expect(screen.queryByTestId('start-sprint')).toBeNull())
  })
})

describe('Tickets Page', () => {
  it('shows 3 seed tickets', async () => {
    render(<TicketsPage />)
    await waitFor(() => expect(screen.getAllByTestId('ticket-item').length).toBe(3))
  })

  it('filters by open', async () => {
    render(<TicketsPage />)
    await waitFor(() => screen.getAllByTestId('ticket-item'))
    fireEvent.change(screen.getByTestId('ticket-status-filter'), { target: { value: 'open' } })
    expect(screen.getAllByTestId('ticket-item').length).toBe(2)
  })
})

describe('Team Page', () => {
  it('shows 3 seed team members', async () => {
    render(<TeamPage />)
    await waitFor(() => expect(screen.getAllByTestId('team-item').length).toBe(3))
  })

  it('adds a new team member', async () => {
    render(<TeamPage />)
    await waitFor(() => screen.getAllByTestId('team-item'))
    fireEvent.change(screen.getByTestId('team-name-input'), { target: { value: 'New Dev' } })
    fireEvent.change(screen.getByTestId('team-role-input'), { target: { value: 'Frontend' } })
    fireEvent.change(screen.getByTestId('team-email-input'), { target: { value: 'newdev@team.com' } })
    fireEvent.click(screen.getByTestId('submit-team'))
    await waitFor(() => expect(screen.getAllByTestId('team-item').length).toBe(4))
  })
})
