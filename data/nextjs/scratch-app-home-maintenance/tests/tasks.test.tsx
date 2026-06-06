import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { TasksPage } from '../reference/app/tasks/page'
import { HistoryPage } from '../reference/app/history/page'
import { RoomsPage } from '../reference/app/rooms/page'
import { __reset } from '../reference/lib/store'

beforeEach(() => { __reset() })

describe('Tasks Page', () => {
  it('shows 4 seed tasks', async () => {
    render(<TasksPage />)
    await waitFor(() => expect(screen.getAllByTestId('task-item').length).toBe(4))
  })

  it('adds a new task', async () => {
    render(<TasksPage />)
    await waitFor(() => screen.getAllByTestId('task-item'))
    fireEvent.change(screen.getByTestId('task-title-input'), { target: { value: 'Check smoke detectors' } })
    fireEvent.change(screen.getByTestId('task-room-input'), { target: { value: 'Hall' } })
    fireEvent.change(screen.getByTestId('task-due-date-input'), { target: { value: '2024-08-01' } })
    fireEvent.click(screen.getByTestId('submit-task'))
    await waitFor(() => expect(screen.getAllByTestId('task-item').length).toBe(5))
  })

  it('filters by pending status', async () => {
    render(<TasksPage />)
    await waitFor(() => screen.getAllByTestId('task-item'))
    fireEvent.change(screen.getByTestId('task-status-filter'), { target: { value: 'pending' } })
    const items = screen.getAllByTestId('task-item')
    expect(items.length).toBe(3)
  })

  it('marks task complete', async () => {
    render(<TasksPage />)
    await waitFor(() => screen.getAllByTestId('task-item'))
    const btns = screen.getAllByTestId('complete-task')
    fireEvent.click(btns[0])
    await waitFor(() => {
      const items = screen.getAllByTestId('task-item')
      expect(items.length).toBe(4)
    })
  })

  it('deletes a task', async () => {
    render(<TasksPage />)
    await waitFor(() => screen.getAllByTestId('task-item'))
    fireEvent.click(screen.getAllByTestId('delete-task')[0])
    await waitFor(() => expect(screen.getAllByTestId('task-item').length).toBe(3))
  })
})

describe('History Page', () => {
  it('shows completed tasks', async () => {
    render(<HistoryPage />)
    await waitFor(() => expect(screen.getAllByTestId('history-item').length).toBe(1))
  })
})

describe('Rooms Page', () => {
  it('shows distinct rooms', async () => {
    render(<RoomsPage />)
    await waitFor(() => expect(screen.getAllByTestId('room-item').length).toBeGreaterThan(0))
  })
})
