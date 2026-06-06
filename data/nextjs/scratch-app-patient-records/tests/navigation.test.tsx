import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders home page by default', () => {
    render(<App />)
    expect(screen.getByTestId('dashboard-patient-count')).toBeDefined()
  })

  it('navigates to patients page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-patients'))
    expect(screen.getByTestId('patient-list')).toBeDefined()
  })

  it('navigates to appointments page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-appointments'))
    expect(screen.getByTestId('appointment-list')).toBeDefined()
  })

  it('navigates to records page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-records'))
    expect(screen.getByTestId('record-list')).toBeDefined()
  })

  it('navigates back to home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-patients'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('dashboard-patient-count')).toBeDefined()
  })
})
