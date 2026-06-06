import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Invoice Maker Feature', () => {
  it('shows total invoices on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-invoices').textContent).toBe('3')
  })

  it('shows total clients on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-clients').textContent).toBe('2')
  })

  it('shows total revenue (paid only) on home', () => {
    render(<App />)
    // i1 is paid: subtotal=5600, tax=560, total=6160
    expect(screen.getByTestId('total-revenue').textContent).toBe('6160')
  })

  it('renders seed invoices on invoices page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-invoices'))
    expect(screen.getByTestId('invoice-item-i1')).toBeTruthy()
    expect(screen.getByTestId('invoice-item-i2')).toBeTruthy()
    expect(screen.getByTestId('invoice-item-i3')).toBeTruthy()
  })

  it('renders seed clients on clients page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-clients'))
    expect(screen.getByTestId('client-item-c1')).toBeTruthy()
    expect(screen.getByTestId('client-item-c2')).toBeTruthy()
  })

  it('adds a new client', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-clients'))
    fireEvent.change(screen.getByTestId('input-client-name'), { target: { value: 'New Co' } })
    fireEvent.change(screen.getByTestId('input-client-email'), { target: { value: 'new@co.com' } })
    fireEvent.click(screen.getByTestId('add-client-btn'))
    expect(screen.getByText('New Co')).toBeTruthy()
  })

  it('preview invoice shows correct total', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-preview'))
    fireEvent.change(screen.getByTestId('invoice-select'), { target: { value: 'i1' } })
    expect(screen.getByTestId('preview-total').textContent).toBe('6160')
  })

  it('preview shows subtotal correctly', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-preview'))
    fireEvent.change(screen.getByTestId('invoice-select'), { target: { value: 'i1' } })
    expect(screen.getByTestId('preview-subtotal').textContent).toBe('5600')
  })

  it('preview shows line items', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-preview'))
    fireEvent.change(screen.getByTestId('invoice-select'), { target: { value: 'i1' } })
    expect(screen.getByTestId('preview-item-0')).toBeTruthy()
    expect(screen.getByTestId('preview-item-1')).toBeTruthy()
  })

  it('preview shows client name', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-preview'))
    fireEvent.change(screen.getByTestId('invoice-select'), { target: { value: 'i1' } })
    expect(screen.getByTestId('preview-client').textContent).toBe('Acme Corp')
  })

  it('preview shows status', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-preview'))
    fireEvent.change(screen.getByTestId('invoice-select'), { target: { value: 'i2' } })
    expect(screen.getByTestId('preview-status').textContent).toBe('sent')
  })
})
