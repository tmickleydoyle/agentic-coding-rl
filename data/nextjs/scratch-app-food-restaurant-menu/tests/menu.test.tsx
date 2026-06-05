import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('menu list and filters', () => {
  it('lists seeded dishes', () => {
    render(<App />)
    const list = screen.getByTestId('dish-list')
    expect(within(list).getByText('Bruschetta')).toBeInTheDocument()
    expect(within(list).getByText('Ribeye Steak')).toBeInTheDocument()
    expect(within(list).getByText('Tiramisu')).toBeInTheDocument()
  })

  it('marks vegetarian dishes', () => {
    render(<App />)
    expect(screen.getByTestId('dish-d1')).toHaveAttribute('data-veg', 'true')
    expect(screen.getByTestId('dish-d2')).toHaveAttribute('data-veg', 'false')
  })

  it('filters dishes by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'Main')
    expect(screen.getByTestId('dish-d3')).toBeInTheDocument()
    expect(screen.getByTestId('dish-d4')).toBeInTheDocument()
    expect(screen.queryByTestId('dish-d1')).not.toBeInTheDocument()
  })

  it('filters to vegetarian only', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('veg-only'))
    expect(screen.getByTestId('dish-d1')).toBeInTheDocument()
    expect(screen.getByTestId('dish-d3')).toBeInTheDocument()
    expect(screen.getByTestId('dish-d5')).toBeInTheDocument()
    expect(screen.queryByTestId('dish-d2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('dish-d4')).not.toBeInTheDocument()
  })

  it('combines category and vegetarian filters into an empty state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'Dessert')
    await user.click(screen.getByTestId('veg-only'))
    // Dessert (Tiramisu) is vegetarian, so still shows; switch to a combo with nothing:
    await user.selectOptions(screen.getByTestId('category-filter'), 'Main')
    // Main veg = Margherita only
    expect(screen.getByTestId('dish-d3')).toBeInTheDocument()
    expect(screen.queryByTestId('dish-d4')).not.toBeInTheDocument()
  })

  it('views a dish detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-d4'))
    expect(screen.getByTestId('page-item-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Ribeye Steak')
    expect(screen.getByTestId('detail-price')).toHaveTextContent('28')
  })

  it('shows no-selection on item-detail without a selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-item-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})
