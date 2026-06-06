import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RatingStars from '../components/RatingStars'

describe('RatingStars', () => {
  it('shows rating 0 initially', () => {
    render(<RatingStars />)
    expect(screen.getByTestId('rating-value')).toHaveTextContent('0')
  })

  it('all stars start as empty (☆)', () => {
    render(<RatingStars />)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveTextContent('☆')
    }
  })

  it('clicking star 3 sets rating to 3', async () => {
    const user = userEvent.setup()
    render(<RatingStars />)
    await user.click(screen.getByTestId('star-3'))
    expect(screen.getByTestId('rating-value')).toHaveTextContent('3')
  })

  it('stars 1-3 become filled after clicking star 3', async () => {
    const user = userEvent.setup()
    render(<RatingStars />)
    await user.click(screen.getByTestId('star-3'))
    expect(screen.getByTestId('star-1')).toHaveTextContent('★')
    expect(screen.getByTestId('star-2')).toHaveTextContent('★')
    expect(screen.getByTestId('star-3')).toHaveTextContent('★')
  })

  it('stars 4-5 remain empty after clicking star 3', async () => {
    const user = userEvent.setup()
    render(<RatingStars />)
    await user.click(screen.getByTestId('star-3'))
    expect(screen.getByTestId('star-4')).toHaveTextContent('☆')
    expect(screen.getByTestId('star-5')).toHaveTextContent('☆')
  })

  it('clicking star 5 sets rating to 5 and all stars filled', async () => {
    const user = userEvent.setup()
    render(<RatingStars />)
    await user.click(screen.getByTestId('star-5'))
    expect(screen.getByTestId('rating-value')).toHaveTextContent('5')
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveTextContent('★')
    }
  })

  it('clicking star 1 sets rating to 1', async () => {
    const user = userEvent.setup()
    render(<RatingStars />)
    await user.click(screen.getByTestId('star-5'))
    await user.click(screen.getByTestId('star-1'))
    expect(screen.getByTestId('rating-value')).toHaveTextContent('1')
    expect(screen.getByTestId('star-1')).toHaveTextContent('★')
    expect(screen.getByTestId('star-2')).toHaveTextContent('☆')
  })
})
