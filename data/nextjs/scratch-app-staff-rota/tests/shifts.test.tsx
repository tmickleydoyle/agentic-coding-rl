import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { __reset, getShifts, getStaff } from '../lib/store'

beforeEach(() => { __reset() })

describe('Shifts feature', () => {
  it('displays seed shifts', async () => {
    const { ShiftsPage } = await import('../app/shifts/page')
    global.fetch = vi.fn().mockImplementation(async (url: RequestInfo) => {
      if (String(url).includes('staff')) return { json: async () => getStaff() }
      return { json: async () => getShifts() }
    }) as unknown as typeof fetch
    render(<ShiftsPage />)
    await waitFor(() => {
      expect(screen.getAllByTestId('shift-item').length).toBe(6)
    })
  })

  it('shows shift role', async () => {
    const { ShiftsPage } = await import('../app/shifts/page')
    global.fetch = vi.fn().mockImplementation(async (url: RequestInfo) => {
      if (String(url).includes('staff')) return { json: async () => getStaff() }
      return { json: async () => getShifts() }
    }) as unknown as typeof fetch
    render(<ShiftsPage />)
    await waitFor(() => {
      expect(screen.getAllByTestId('shift-role')[0].textContent).toBe('Manager')
    })
  })

  it('add shift form has required fields', async () => {
    const { ShiftsPage } = await import('../app/shifts/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<ShiftsPage />)
    expect(screen.getByTestId('select-shift-staff')).toBeTruthy()
    expect(screen.getByTestId('input-shift-date')).toBeTruthy()
    expect(screen.getByTestId('input-shift-start')).toBeTruthy()
    expect(screen.getByTestId('input-shift-end')).toBeTruthy()
    expect(screen.getByTestId('input-shift-role')).toBeTruthy()
    expect(screen.getByTestId('btn-add-shift')).toBeTruthy()
  })

  it('submits new shift', async () => {
    const { ShiftsPage } = await import('../app/shifts/page')
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch
    render(<ShiftsPage />)
    fireEvent.change(screen.getByTestId('input-shift-date'), { target: { value: '2024-06-15' } })
    fireEvent.change(screen.getByTestId('input-shift-start'), { target: { value: '09:00' } })
    fireEvent.change(screen.getByTestId('input-shift-end'), { target: { value: '17:00' } })
    fireEvent.change(screen.getByTestId('input-shift-role'), { target: { value: 'Associate' } })
    fireEvent.click(screen.getByTestId('btn-add-shift'))
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/shifts', expect.objectContaining({ method: 'POST' }))
    })
  })
})
