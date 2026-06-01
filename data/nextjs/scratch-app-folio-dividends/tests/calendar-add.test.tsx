import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('dividend calendar', () => {
  it('groups holdings by pay month with summed income, ordered ascending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-calendar'))
    const list = screen.getByTestId('calendar-list')
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    // ascending: Mar (3), Jun (6), Dec (12)
    expect(items[0]).toHaveAttribute('data-testid', 'month-3')
    expect(items[1]).toHaveAttribute('data-testid', 'month-6')
    expect(items[2]).toHaveAttribute('data-testid', 'month-12')
    expect(screen.getByTestId('month-3-income')).toHaveTextContent('350') // KO 200 + PEP 150
    expect(screen.getByTestId('month-3-count')).toHaveTextContent('2')
    expect(screen.getByTestId('month-12-name')).toHaveTextContent('Dec')
  })

  it('shows the empty state when no holdings remain', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-h1'))
    await user.click(screen.getByTestId('remove-holding'))
    await user.click(screen.getByTestId('select-h2'))
    await user.click(screen.getByTestId('remove-holding'))
    await user.click(screen.getByTestId('select-h3'))
    await user.click(screen.getByTestId('remove-holding'))
    await user.click(screen.getByTestId('select-h4'))
    await user.click(screen.getByTestId('remove-holding'))
    await user.click(screen.getByTestId('nav-calendar'))
    expect(screen.getByTestId('empty-calendar')).toBeInTheDocument()
  })
})

describe('add holding flow', () => {
  it('blocks submitting with a blank symbol', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('shares-input'), '10')
    await user.type(screen.getByTestId('per-share-input'), '2')
    await user.click(screen.getByTestId('submit-holding'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks submitting with a non-positive dividend per share', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'XOM')
    await user.type(screen.getByTestId('shares-input'), '10')
    await user.type(screen.getByTestId('per-share-input'), '0')
    await user.click(screen.getByTestId('submit-holding'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a holding and updates totals and calendar', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'xom')
    await user.type(screen.getByTestId('shares-input'), '40')
    await user.type(screen.getByTestId('per-share-input'), '4')
    await user.selectOptions(screen.getByTestId('month-input'), '6')
    await user.click(screen.getByTestId('submit-holding'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(within(screen.getByTestId('holding-list')).getByText('XOM')).toBeInTheDocument()
    // 40 * 4 = 160 income; total 850 + 160 = 1010
    expect(screen.getByTestId('holding-h5-income')).toHaveTextContent('160')
    expect(screen.getByTestId('stat-income-value')).toHaveTextContent('1010')
    // June now has JNJ 200 + XOM 160 = 360
    await user.click(screen.getByTestId('nav-calendar'))
    expect(screen.getByTestId('month-6-income')).toHaveTextContent('360')
  })
})
