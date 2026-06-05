import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('gigs and filters', () => {
  it('lists seeded gigs with price and average rating', () => {
    render(<App />)
    expect(screen.getByTestId('gig-g1-title')).toHaveTextContent('Logo design')
    expect(screen.getByTestId('gig-g1-price')).toHaveTextContent('80')
    expect(screen.getByTestId('gig-g1-rating')).toHaveTextContent('4.5')
    expect(screen.getByTestId('gig-g2-rating')).toHaveTextContent('0')
    expect(screen.getByTestId('gig-g3-rating')).toHaveTextContent('3')
  })

  it('filters gigs by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'writing')
    expect(screen.getByTestId('gig-g2')).toBeInTheDocument()
    expect(screen.queryByTestId('gig-g1')).not.toBeInTheDocument()
  })

  it('shows an empty state when no gig matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'audio')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('gig-list')).not.toBeInTheDocument()
  })
})

describe('detail and reviews', () => {
  it('opens a gig detail and shows its reviews', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    expect(screen.getByTestId('page-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Logo design')
    expect(screen.getByTestId('review-r1')).toBeInTheDocument()
    expect(screen.getByTestId('review-r1-author')).toHaveTextContent('sam')
  })

  it('shows no-reviews for a gig without reviews', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g2'))
    expect(screen.getByTestId('no-reviews')).toBeInTheDocument()
    expect(screen.queryByTestId('review-list')).not.toBeInTheDocument()
  })

  it('adds a review and it appears, updating the average', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g3')) // one review rating 3
    await user.type(screen.getByTestId('review-author'), 'pat')
    await user.clear(screen.getByTestId('review-rating'))
    await user.type(screen.getByTestId('review-rating'), '5')
    await user.type(screen.getByTestId('review-text'), 'Nice')
    await user.click(screen.getByTestId('submit-review'))
    const list = screen.getByTestId('review-list')
    expect(within(list).getByText('pat')).toBeInTheDocument()
    // (3 + 5) / 2 = 4
    expect(screen.getByTestId('detail-rating')).toHaveTextContent('4')
  })
})

describe('booking flow', () => {
  it('blocks booking with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('book-this'))
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
    await user.click(screen.getByTestId('submit-booking'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-book')).toBeInTheDocument()
  })

  it('books a gig and shows it under my bookings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-g1'))
    await user.click(screen.getByTestId('book-this'))
    await user.type(screen.getByTestId('book-name'), 'Jordan')
    await user.click(screen.getByTestId('submit-booking'))
    expect(screen.getByTestId('page-bookings')).toBeInTheDocument()
    expect(screen.getByTestId('booking-bk1-gig')).toHaveTextContent('Logo design')
    expect(screen.getByTestId('booking-bk1-name')).toHaveTextContent('Jordan')
  })

  it('shows no-bookings empty state initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-bookings'))
    expect(screen.getByTestId('no-bookings')).toBeInTheDocument()
    expect(screen.queryByTestId('bookings-list')).not.toBeInTheDocument()
  })
})
