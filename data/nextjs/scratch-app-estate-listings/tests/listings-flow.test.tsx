import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('listings flow', () => {
  it('lists seeded properties on the listings page', () => {
    render(<App />)
    const list = screen.getByTestId('property-list')
    expect(within(list).getByText('12 Oak St')).toBeInTheDocument()
    expect(within(list).getByText('500 Pine Ave')).toBeInTheDocument()
    expect(within(list).getByText('88 Maple Rd')).toBeInTheDocument()
    expect(within(list).getByText('7 Birch Ln')).toBeInTheDocument()
  })

  it('shows the listing count', () => {
    render(<App />)
    expect(screen.getByTestId('listing-count')).toHaveTextContent('4')
  })

  it('filters by property type', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-filters'))
    await user.selectOptions(screen.getByTestId('type-filter'), 'house')
    await user.click(screen.getByTestId('apply-filters'))
    expect(screen.getByTestId('property-h1')).toBeInTheDocument()
    expect(screen.getByTestId('property-h4')).toBeInTheDocument()
    expect(screen.queryByTestId('property-h2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('property-h3')).not.toBeInTheDocument()
  })

  it('filters by minimum beds', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-filters'))
    await user.selectOptions(screen.getByTestId('beds-filter'), '4')
    await user.click(screen.getByTestId('apply-filters'))
    expect(screen.getByTestId('property-h3')).toBeInTheDocument() // 4 beds
    expect(screen.getByTestId('property-h4')).toBeInTheDocument() // 5 beds
    expect(screen.queryByTestId('property-h1')).not.toBeInTheDocument() // 3 beds
    expect(screen.queryByTestId('property-h2')).not.toBeInTheDocument() // 2 beds
  })

  it('filters by max price', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-filters'))
    await user.type(screen.getByTestId('max-price'), '400000')
    await user.click(screen.getByTestId('apply-filters'))
    expect(screen.getByTestId('property-h2')).toBeInTheDocument() // 320000
    expect(screen.queryByTestId('property-h1')).not.toBeInTheDocument() // 450000
    expect(screen.queryByTestId('property-h4')).not.toBeInTheDocument() // 615000
  })

  it('combines type and beds filters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-filters'))
    await user.selectOptions(screen.getByTestId('type-filter'), 'house')
    await user.selectOptions(screen.getByTestId('beds-filter'), '4')
    await user.click(screen.getByTestId('apply-filters'))
    expect(screen.getByTestId('property-h4')).toBeInTheDocument() // house, 5 beds
    expect(screen.queryByTestId('property-h1')).not.toBeInTheDocument() // house, 3 beds
  })

  it('shows an empty state when no property matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-filters'))
    await user.selectOptions(screen.getByTestId('type-filter'), 'condo')
    await user.selectOptions(screen.getByTestId('beds-filter'), '4')
    await user.click(screen.getByTestId('apply-filters'))
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('property-list')).not.toBeInTheDocument()
  })

  it('shows the average price of all properties', () => {
    render(<App />)
    // (450000 + 320000 + 510000 + 615000) / 4 = 473750
    expect(screen.getByTestId('average-price')).toHaveTextContent('473750')
  })
})
