import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('usage page', () => {
  it('lists all keys with their usage counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-usage'))
    expect(screen.getByTestId('usage-k1-count')).toHaveTextContent('12')
    expect(screen.getByTestId('usage-k2-count')).toHaveTextContent('4')
    expect(screen.getByTestId('usage-k3-count')).toHaveTextContent('99')
  })

  it('sums total usage of the visible keys', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-usage'))
    // 12 + 4 + 99 = 115
    expect(screen.getByTestId('stat-total-usage-value')).toHaveTextContent('115')
  })

  it('filters to active keys and updates the total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-usage'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'active')
    expect(screen.getByTestId('usage-k1')).toBeInTheDocument()
    expect(screen.getByTestId('usage-k2')).toBeInTheDocument()
    expect(screen.queryByTestId('usage-k3')).not.toBeInTheDocument()
    // 12 + 4 = 16
    expect(screen.getByTestId('stat-total-usage-value')).toHaveTextContent('16')
  })

  it('filters to revoked keys', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-usage'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'revoked')
    expect(screen.getByTestId('usage-k3')).toBeInTheDocument()
    expect(screen.queryByTestId('usage-k1')).not.toBeInTheDocument()
  })

  it('reflects a usage increment recorded on the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-k2'))
    await user.click(screen.getByTestId('use-btn'))
    await user.click(screen.getByTestId('nav-usage'))
    expect(screen.getByTestId('usage-k2-count')).toHaveTextContent('5')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
