import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Property Listings', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /property listings/i })).toBeInTheDocument()
  })

  it('shows all 5 seed properties', () => {
    render(<App />)
    expect(screen.getAllByTestId('property-card')).toHaveLength(5)
  })

  it('shows count of 5 initially', () => {
    render(<App />)
    expect(screen.getByTestId('count').textContent).toBe('5 properties found')
  })

  it('filters by address search', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/search by address/i), 'Oak')
    expect(screen.getAllByTestId('property-card')).toHaveLength(1)
    expect(screen.getByTestId('count').textContent).toBe('1 properties found')
  })

  it('filters by type', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/type/i), 'House')
    expect(screen.getAllByTestId('property-card')).toHaveLength(2)
  })

  it('filters by max rent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/max rent/i), '1500')
    expect(screen.getAllByTestId('property-card')).toHaveLength(2)
  })

  it('shows no-results when no match', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/search by address/i), 'ZZZNOMATCH')
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
  })

  it('toggles details panel on View Details click', async () => {
    const user = userEvent.setup()
    render(<App />)
    const buttons = screen.getAllByRole('button', { name: /view details/i })
    await user.click(buttons[0])
    expect(screen.getByTestId('property-details')).toBeInTheDocument()
    await user.click(buttons[0])
    expect(screen.queryByTestId('property-details')).not.toBeInTheDocument()
  })

  it('only one details panel open at a time', async () => {
    const user = userEvent.setup()
    render(<App />)
    const buttons = screen.getAllByRole('button', { name: /view details/i })
    await user.click(buttons[0])
    await user.click(buttons[1])
    expect(screen.getAllByTestId('property-details')).toHaveLength(1)
  })

  it('details panel contains address text', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: /view details/i })[0])
    expect(screen.getByTestId('property-details').textContent).toContain('101 Maple St')
  })

  it('clear filters resets all filters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/search by address/i), 'Oak')
    await user.click(screen.getByRole('button', { name: /clear filters/i }))
    expect(screen.getAllByTestId('property-card')).toHaveLength(5)
  })

  it('combined filters work', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/type/i), 'Apartment')
    await user.type(screen.getByLabelText(/max rent/i), '1600')
    expect(screen.getAllByTestId('property-card')).toHaveLength(1)
    expect(screen.getByText('101 Maple St')).toBeInTheDocument()
  })

  it('shows rent formatted as $N/mo', () => {
    render(<App />)
    expect(screen.getByText('$1500/mo')).toBeInTheDocument()
  })
})
