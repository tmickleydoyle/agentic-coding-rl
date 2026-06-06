import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { MedicinesPage } from '../reference/app/medicines/page'
import { SchedulePage } from '../reference/app/schedule/page'
import { __reset } from '../reference/lib/store'

beforeEach(() => { __reset() })

describe('Medicines Page', () => {
  it('shows 3 seed medicines', async () => {
    render(<MedicinesPage />)
    await waitFor(() => expect(screen.getAllByTestId('medicine-item').length).toBe(3))
  })

  it('shows Aspirin in list', async () => {
    render(<MedicinesPage />)
    await waitFor(() => expect(screen.getByText(/Aspirin/)).toBeDefined())
  })

  it('adds a new medicine', async () => {
    render(<MedicinesPage />)
    await waitFor(() => screen.getAllByTestId('medicine-item'))
    fireEvent.change(screen.getByTestId('medicine-name-input'), { target: { value: 'Ibuprofen' } })
    fireEvent.change(screen.getByTestId('medicine-dosage-input'), { target: { value: '200mg' } })
    fireEvent.click(screen.getByTestId('submit-medicine'))
    await waitFor(() => expect(screen.getAllByTestId('medicine-item').length).toBe(4))
  })

  it('deletes a medicine', async () => {
    render(<MedicinesPage />)
    await waitFor(() => screen.getAllByTestId('medicine-item'))
    const btns = screen.getAllByTestId('delete-medicine')
    fireEvent.click(btns[0])
    await waitFor(() => expect(screen.getAllByTestId('medicine-item').length).toBe(2))
  })
})

describe('Schedule Page', () => {
  it('shows schedule items', async () => {
    render(<SchedulePage />)
    await waitFor(() => expect(screen.getAllByTestId('schedule-item').length).toBeGreaterThan(0))
  })
})
