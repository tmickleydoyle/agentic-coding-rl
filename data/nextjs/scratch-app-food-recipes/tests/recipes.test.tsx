import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('recipes list, search, filter, favorite', () => {
  it('lists seeded recipes', () => {
    render(<App />)
    const list = screen.getByTestId('recipe-list')
    expect(within(list).getByText('Margherita Pizza')).toBeInTheDocument()
    expect(within(list).getByText('Chicken Tacos')).toBeInTheDocument()
    expect(within(list).getByText('Pad Thai')).toBeInTheDocument()
    expect(within(list).getByText('Spaghetti Carbonara')).toBeInTheDocument()
  })

  it('searches recipes by title (case-insensitive)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('search-input'), 'pizza')
    expect(screen.getByTestId('recipe-r1')).toBeInTheDocument()
    expect(screen.queryByTestId('recipe-r2')).not.toBeInTheDocument()
  })

  it('shows empty state when nothing matches the search', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('search-input'), 'zzz')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('recipe-list')).not.toBeInTheDocument()
  })

  it('filters recipes by cuisine', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('cuisine-filter'), 'Italian')
    expect(screen.getByTestId('recipe-r1')).toBeInTheDocument()
    expect(screen.getByTestId('recipe-r4')).toBeInTheDocument()
    expect(screen.queryByTestId('recipe-r2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('recipe-r3')).not.toBeInTheDocument()
  })

  it('toggles favorite from the list and updates the badge', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('recipe-r1')).toHaveAttribute('data-favorite', 'false')
    await user.click(screen.getByTestId('fav-r1'))
    expect(screen.getByTestId('recipe-r1')).toHaveAttribute('data-favorite', 'true')
    expect(screen.getByTestId('fav-badge')).toHaveTextContent('2')
  })

  it('combines cuisine filter and search query', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('cuisine-filter'), 'Italian')
    await user.type(screen.getByTestId('search-input'), 'carbonara')
    expect(screen.getByTestId('recipe-r4')).toBeInTheDocument()
    expect(screen.queryByTestId('recipe-r1')).not.toBeInTheDocument()
  })
})
