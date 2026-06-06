import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { HoldingsPage } from '../reference/app/holdings/page'
import { PerformancePage } from '../reference/app/performance/page'
import { __reset } from '../reference/lib/store'

beforeEach(() => { __reset() })

describe('Holdings Page', () => {
  it('shows 3 seed holdings', async () => {
    render(<HoldingsPage />)
    await waitFor(() => expect(screen.getAllByTestId('holding-item').length).toBe(3))
  })

  it('shows AAPL holding', async () => {
    render(<HoldingsPage />)
    await waitFor(() => expect(screen.getByText(/AAPL/)).toBeDefined())
  })

  it('adds a new holding', async () => {
    render(<HoldingsPage />)
    await waitFor(() => screen.getAllByTestId('holding-item'))
    fireEvent.change(screen.getByTestId('holding-symbol-input'), { target: { value: 'TSLA' } })
    fireEvent.change(screen.getByTestId('holding-name-input'), { target: { value: 'Tesla' } })
    fireEvent.change(screen.getByTestId('holding-quantity-input'), { target: { value: '3' } })
    fireEvent.change(screen.getByTestId('holding-purchase-price-input'), { target: { value: '200' } })
    fireEvent.change(screen.getByTestId('holding-current-price-input'), { target: { value: '250' } })
    fireEvent.click(screen.getByTestId('submit-holding'))
    await waitFor(() => expect(screen.getAllByTestId('holding-item').length).toBe(4))
  })

  it('deletes a holding', async () => {
    render(<HoldingsPage />)
    await waitFor(() => screen.getAllByTestId('holding-item'))
    fireEvent.click(screen.getAllByTestId('delete-holding')[0])
    await waitFor(() => expect(screen.getAllByTestId('holding-item').length).toBe(2))
  })
})

describe('Performance Page', () => {
  it('shows performance items', async () => {
    render(<PerformancePage />)
    await waitFor(() => expect(screen.getAllByTestId('performance-item').length).toBe(3))
  })
})
