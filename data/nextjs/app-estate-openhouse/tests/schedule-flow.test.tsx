import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('schedule and detail', () => {
  it('shows the total visitors across houses', () => {
    render(<App />)
    expect(screen.getByTestId('total-visitors')).toHaveTextContent('3')
  })

  it('lists houses with addresses, times and visitor counts', () => {
    render(<App />)
    expect(screen.getByTestId('house-h1-address')).toHaveTextContent('12 Oak St')
    expect(screen.getByTestId('house-h1-time')).toHaveTextContent('10:00')
    expect(screen.getByTestId('house-h1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('house-h3-count')).toHaveTextContent('0')
  })

  it('opens a house detail with visitors and feedback', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h1'))
    expect(screen.getByTestId('page-house-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-address')).toHaveTextContent('12 Oak St')
    expect(screen.getByTestId('detail-count')).toHaveTextContent('2')
    const visitors = screen.getByTestId('visitor-list')
    expect(within(visitors).getByText('Ada')).toBeInTheDocument()
    expect(within(visitors).getByText('Lee')).toBeInTheDocument()
    expect(screen.getByTestId('feedback-0-visitor')).toHaveTextContent('Ada')
    expect(screen.getByTestId('feedback-0-rating')).toHaveTextContent('5')
  })

  it('shows the average rating on the detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h1'))
    expect(screen.getByTestId('detail-avg')).toHaveTextContent('5')
  })

  it('shows zero average rating when a house has no feedback', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h2'))
    expect(screen.getByTestId('detail-avg')).toHaveTextContent('0')
  })
})
