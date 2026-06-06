import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('HTTP Status Lookup', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /http status codes/i })).toBeInTheDocument()
  })

  it('shows all 25 codes initially', () => {
    expect(screen.getByTestId('result-count')).toHaveTextContent('25 results')
  })

  it('renders all status items initially', () => {
    expect(screen.getAllByTestId('status-item')).toHaveLength(25)
  })

  it('shows code 200 with name OK', () => {
    expect(screen.getByTestId('code-200')).toHaveTextContent('200')
    expect(screen.getByTestId('name-200')).toHaveTextContent('OK')
  })

  it('shows category badge for 200', () => {
    expect(screen.getByTestId('category-200')).toHaveTextContent('2xx')
  })

  it('shows all category filter buttons', () => {
    expect(screen.getByTestId('filter-All')).toBeInTheDocument()
    expect(screen.getByTestId('filter-2xx')).toBeInTheDocument()
    expect(screen.getByTestId('filter-4xx')).toBeInTheDocument()
  })

  it('All filter is active by default', () => {
    expect(screen.getByTestId('filter-All')).toHaveAttribute('aria-pressed', 'true')
  })

  it('filters by category 2xx', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-2xx'))
    expect(screen.getAllByTestId('status-item')).toHaveLength(4)
    expect(screen.getByTestId('result-count')).toHaveTextContent('4 results')
  })

  it('filters by category 4xx', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-4xx'))
    expect(screen.getAllByTestId('status-item')).toHaveLength(9)
  })

  it('filters by search term matching code', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search codes/i), '404')
    expect(screen.getAllByTestId('status-item')).toHaveLength(1)
    expect(screen.getByTestId('code-404')).toBeInTheDocument()
  })

  it('filters by search term matching name (case-insensitive)', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search codes/i), 'not')
    const items = screen.getAllByTestId('status-item')
    expect(items.length).toBeGreaterThanOrEqual(3)
  })

  it('combines search and category filters', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-5xx'))
    await user.type(screen.getByLabelText(/search codes/i), 'gateway')
    const items = screen.getAllByTestId('status-item')
    expect(items).toHaveLength(2)
  })

  it('clicking an item shows its description', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('code-200'))
    expect(screen.getByTestId('desc-200')).toBeInTheDocument()
  })

  it('description not shown initially', () => {
    expect(screen.queryByTestId('desc-200')).not.toBeInTheDocument()
  })

  it('clicking same item again hides description', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('code-200'))
    await user.click(screen.getByTestId('code-200'))
    expect(screen.queryByTestId('desc-200')).not.toBeInTheDocument()
  })

  it('opening a new item closes previous', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('code-200'))
    await user.click(screen.getByTestId('code-404'))
    expect(screen.queryByTestId('desc-200')).not.toBeInTheDocument()
    expect(screen.getByTestId('desc-404')).toBeInTheDocument()
  })
})
