import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { PatientsPage } from '../reference/app/patients/page'
import { __reset } from '../reference/lib/store'

beforeEach(() => { __reset() })

describe('Patients Page', () => {
  it('shows seed patients', async () => {
    render(<PatientsPage />)
    await waitFor(() => {
      const items = screen.getAllByTestId('patient-item')
      expect(items.length).toBe(3)
    })
  })

  it('shows Alice Johnson in list', async () => {
    render(<PatientsPage />)
    await waitFor(() => {
      expect(screen.getByText(/Alice Johnson/)).toBeDefined()
    })
  })

  it('filters patients by search', async () => {
    render(<PatientsPage />)
    await waitFor(() => screen.getAllByTestId('patient-item'))
    fireEvent.change(screen.getByTestId('patient-search'), { target: { value: 'alice' } })
    const items = screen.getAllByTestId('patient-item')
    expect(items.length).toBe(1)
  })

  it('adds a new patient', async () => {
    render(<PatientsPage />)
    await waitFor(() => screen.getAllByTestId('patient-item'))
    fireEvent.change(screen.getByTestId('patient-name-input'), { target: { value: 'Dave Lee' } })
    fireEvent.change(screen.getByTestId('patient-dob-input'), { target: { value: '1995-01-01' } })
    fireEvent.change(screen.getByTestId('patient-phone-input'), { target: { value: '555-0200' } })
    fireEvent.click(screen.getByTestId('submit-patient'))
    await waitFor(() => {
      const items = screen.getAllByTestId('patient-item')
      expect(items.length).toBe(4)
    })
  })

  it('renders add patient form', () => {
    render(<PatientsPage />)
    expect(screen.getByTestId('add-patient-form')).toBeDefined()
    expect(screen.getByTestId('patient-name-input')).toBeDefined()
    expect(screen.getByTestId('patient-gender-select')).toBeDefined()
  })
})
