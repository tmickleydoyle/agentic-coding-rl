import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../app/page'

describe('dashboard kpi cards', () => {
  it('shows on/off-track summary counts', () => {
    render(<App />)
    // k1 on, k2 off, k3 on, k4 on => 3 on / 1 off
    expect(screen.getByTestId('summary-ontrack')).toHaveTextContent('3')
    expect(screen.getByTestId('summary-offtrack')).toHaveTextContent('1')
    expect(screen.getByTestId('summary-total')).toHaveTextContent('4')
  })

  it('marks each card on/off track correctly', () => {
    render(<App />)
    expect(screen.getByTestId('kpi-k1')).toHaveAttribute('data-ontrack', 'true')
    expect(screen.getByTestId('kpi-k2')).toHaveAttribute('data-ontrack', 'false')
    expect(screen.getByTestId('kpi-k3')).toHaveAttribute('data-ontrack', 'true')
    expect(screen.getByTestId('kpi-k4')).toHaveAttribute('data-ontrack', 'true')
  })

  it('shows status text on cards', () => {
    render(<App />)
    expect(screen.getByTestId('kpi-k1-status')).toHaveTextContent('on-track')
    expect(screen.getByTestId('kpi-k2-status')).toHaveTextContent('off-track')
  })

  it('shows trend vs previous on cards', () => {
    render(<App />)
    expect(screen.getByTestId('kpi-k1-trend')).toHaveTextContent('up')
    expect(screen.getByTestId('kpi-k3-trend')).toHaveTextContent('down')
    expect(screen.getByTestId('kpi-k1')).toHaveAttribute('data-trend', 'up')
    expect(screen.getByTestId('kpi-k4')).toHaveAttribute('data-trend', 'down')
  })

  it('shows current and target on cards', () => {
    render(<App />)
    expect(screen.getByTestId('kpi-k1-current')).toHaveTextContent('120')
    expect(screen.getByTestId('kpi-k1-target')).toHaveTextContent('110')
  })
})
