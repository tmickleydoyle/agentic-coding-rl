import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('dashboard stats', () => {
  it('shows totals from seed data', () => {
    render(<App />)
    // seed: 3 invoices; outstanding = 1200 (sent) + 450 (overdue) = 1650; paid = 800; overdue count = 1
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-outstanding-value')).toHaveTextContent('1650')
    expect(screen.getByTestId('stat-paid-value')).toHaveTextContent('800')
    expect(screen.getByTestId('stat-overdue-value')).toHaveTextContent('1')
  })

  it('shows per-status counts', () => {
    render(<App />)
    expect(screen.getByTestId('status-count-draft-value')).toHaveTextContent('0')
    expect(screen.getByTestId('status-count-sent-value')).toHaveTextContent('1')
    expect(screen.getByTestId('status-count-paid-value')).toHaveTextContent('1')
    expect(screen.getByTestId('status-count-overdue-value')).toHaveTextContent('1')
  })

  it('updates outstanding and paid after marking an invoice paid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-invoices'))
    await user.click(screen.getByTestId('mark-paid-i1')) // 1200 sent -> paid
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-outstanding-value')).toHaveTextContent('450')
    expect(screen.getByTestId('stat-paid-value')).toHaveTextContent('2000')
  })

  it('updates totals after adding an invoice', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new-invoice'))
    await user.type(screen.getByTestId('amount-input'), '500')
    await user.click(screen.getByTestId('submit-invoice'))
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('4')
    expect(screen.getByTestId('status-count-draft-value')).toHaveTextContent('1')
  })

  it('toggles theme and reflects it on the root', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('persists the theme when navigating away and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('theme-toggle'))
    await user.click(screen.getByTestId('nav-invoices'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })
})
