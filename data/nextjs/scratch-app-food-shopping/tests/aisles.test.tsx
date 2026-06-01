import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('aisles grouping', () => {
  it('groups seeded items by aisle with counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-aisles'))
    // Dairy: Milk + Cheddar = 2; Produce: Apples + Bananas = 2
    expect(screen.getByTestId('aisle-Dairy-count')).toHaveTextContent('2')
    expect(screen.getByTestId('aisle-Produce-count')).toHaveTextContent('2')
  })

  it('renders each aisle group section', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-aisles'))
    expect(screen.getByTestId('aisle-Dairy')).toBeInTheDocument()
    expect(screen.getByTestId('aisle-Produce')).toBeInTheDocument()
  })

  it('reflects a newly added aisle', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Bread')
    await user.type(screen.getByTestId('aisle-input'), 'Bakery')
    await user.click(screen.getByTestId('submit-item'))
    await user.click(screen.getByTestId('nav-aisles'))
    expect(screen.getByTestId('aisle-Bakery-count')).toHaveTextContent('1')
  })

  it('shows the aisles-empty state when no items remain', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('remove-i1'))
    await user.click(screen.getByTestId('remove-i2'))
    await user.click(screen.getByTestId('remove-i3'))
    await user.click(screen.getByTestId('remove-i4'))
    await user.click(screen.getByTestId('nav-aisles'))
    expect(screen.getByTestId('aisles-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('aisle-groups')).not.toBeInTheDocument()
  })
})
