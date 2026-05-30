import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('browse and filters', () => {
  it('lists seeded listings', () => {
    render(<App />)
    const list = screen.getByTestId('listing-list')
    expect(within(list).getByText('iPhone 12')).toBeInTheDocument()
    expect(within(list).getByText('Oak desk')).toBeInTheDocument()
    expect(within(list).getByText('Road bike')).toBeInTheDocument()
  })

  it('filters listings by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'furniture')
    expect(screen.getByTestId('listing-l2')).toBeInTheDocument()
    expect(screen.queryByTestId('listing-l1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('listing-l3')).not.toBeInTheDocument()
  })

  it('shows an empty state when no listing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'misc')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('listing-list')).not.toBeInTheDocument()
  })

  it('favorites a listing from the browse list', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('fav-l1')).toHaveTextContent('Favorite')
    await user.click(screen.getByTestId('fav-l1'))
    expect(screen.getByTestId('fav-l1')).toHaveTextContent('Unfavorite')
    expect(screen.getByTestId('listing-l1')).toHaveAttribute('data-favorited', 'true')
  })
})
