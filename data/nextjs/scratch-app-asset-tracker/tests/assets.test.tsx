import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Asset Tracker Feature', () => {
  it('shows total assets on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-assets').textContent).toBe('4')
  })

  it('shows total original value on home', () => {
    render(<App />)
    // 3000 + 800 + 30000 + 150 = 33950
    expect(screen.getByTestId('total-original-value').textContent).toBe('33950')
  })

  it('renders seed assets on assets page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-assets'))
    expect(screen.getByTestId('asset-card-a1')).toBeTruthy()
    expect(screen.getByTestId('asset-card-a2')).toBeTruthy()
    expect(screen.getByTestId('asset-card-a3')).toBeTruthy()
    expect(screen.getByTestId('asset-card-a4')).toBeTruthy()
  })

  it('adds a new asset', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-assets'))
    fireEvent.change(screen.getByTestId('input-asset-name'), { target: { value: 'Printer' } })
    fireEvent.change(screen.getByTestId('input-asset-category'), { target: { value: 'Electronics' } })
    fireEvent.change(screen.getByTestId('input-asset-price'), { target: { value: '500' } })
    fireEvent.change(screen.getByTestId('input-asset-year'), { target: { value: '2025' } })
    fireEvent.change(screen.getByTestId('input-asset-depreciation'), { target: { value: '20' } })
    fireEvent.click(screen.getByTestId('add-asset-btn'))
    expect(screen.getByText('Printer')).toBeTruthy()
  })

  it('depreciation page shows dep rows', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-depreciation'))
    expect(screen.getByTestId('dep-row-a1')).toBeTruthy()
    expect(screen.getByTestId('dep-row-a3')).toBeTruthy()
  })

  it('a1 current value is 1687.5', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-depreciation'))
    expect(screen.getByTestId('dep-current-a1').textContent).toBe('1687.5')
  })

  it('a1 depreciated amount is 1312.5', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-depreciation'))
    expect(screen.getByTestId('dep-amount-a1').textContent).toBe('1312.5')
  })

  it('categories page shows Electronics', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('cat-Electronics')).toBeTruthy()
  })

  it('categories shows correct asset count', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-categories'))
    // Electronics: a1 + a4 = 2 assets
    expect(screen.getByTestId('cat-Electronics').textContent).toContain('2')
  })

  it('categories shows Vehicles and Furniture', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('cat-Vehicles')).toBeTruthy()
    expect(screen.getByTestId('cat-Furniture')).toBeTruthy()
  })
})
