import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('saved and compare', () => {
  it('lists seeded properties on the properties page', () => {
    render(<App />)
    const list = screen.getByTestId('property-list')
    expect(within(list).getByText('12 Oak St')).toBeInTheDocument()
    expect(within(list).getByText('500 Pine Ave')).toBeInTheDocument()
    expect(within(list).getByText('88 Maple Rd')).toBeInTheDocument()
  })

  it('saves a property from the properties page', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('property-p1')).toHaveAttribute('data-saved', 'false')
    await user.click(screen.getByTestId('save-p1'))
    expect(screen.getByTestId('property-p1')).toHaveAttribute('data-saved', 'true')
  })

  it('shows saved properties with a count on the saved page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('save-p1'))
    await user.click(screen.getByTestId('save-p2'))
    await user.click(screen.getByTestId('nav-saved'))
    expect(screen.getByTestId('saved-count')).toHaveTextContent('2')
    const list = screen.getByTestId('saved-list')
    expect(within(list).getByText('12 Oak St')).toBeInTheDocument()
    expect(within(list).getByText('500 Pine Ave')).toBeInTheDocument()
  })

  it('shows a saved empty state initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-saved'))
    expect(screen.getByTestId('saved-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('saved-list')).not.toBeInTheDocument()
  })

  it('unsaves a property from the saved page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('save-p1'))
    await user.click(screen.getByTestId('nav-saved'))
    expect(screen.getByTestId('saved-count')).toHaveTextContent('1')
    await user.click(screen.getByTestId('save-p1'))
    expect(screen.getByTestId('saved-count')).toHaveTextContent('0')
  })

  it('shows a monthly payment for each saved property using default loan params', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('save-p2')) // 320000, default rate 5, term 30, down 0
    await user.click(screen.getByTestId('nav-saved'))
    // P=320000, r=5%/12, n=360 => 1718
    expect(screen.getByTestId('property-p2-monthly')).toHaveTextContent('1718')
  })

  it('compares saved properties and marks the cheapest', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('save-p1')) // 450000
    await user.click(screen.getByTestId('save-p2')) // 320000 (cheapest monthly)
    await user.click(screen.getByTestId('save-p3')) // 510000
    await user.click(screen.getByTestId('nav-compare'))
    expect(screen.getByTestId('compare-p2')).toHaveAttribute('data-cheapest', 'true')
    expect(screen.getByTestId('compare-p1')).toHaveAttribute('data-cheapest', 'false')
    expect(screen.getByTestId('compare-p3')).toHaveAttribute('data-cheapest', 'false')
  })

  it('shows a compare empty state when nothing is saved', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-compare'))
    expect(screen.getByTestId('compare-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('compare-list')).not.toBeInTheDocument()
  })

  it('reflects changed loan params on the compare page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-calculator'))
    await user.clear(screen.getByTestId('rate-input'))
    await user.type(screen.getByTestId('rate-input'), '6')
    await user.clear(screen.getByTestId('term-input'))
    await user.type(screen.getByTestId('term-input'), '15')
    await user.click(screen.getByTestId('nav-compare'))
    expect(screen.getByTestId('compare-rate')).toHaveTextContent('6')
    expect(screen.getByTestId('compare-term')).toHaveTextContent('15')
  })
})
