import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StarRating from '../components/StarRating'

const stars = () => [1, 2, 3, 4, 5].map((i) => screen.getByTestId(`star-${i}`).textContent)

describe('StarRating', () => {
  it('renders all empty for rating 0', () => {
    render(<StarRating rating={0} />)
    expect(stars()).toEqual(['☆', '☆', '☆', '☆', '☆'])
  })

  it('renders 3 filled and 2 empty for rating 3', () => {
    render(<StarRating rating={3} />)
    expect(stars()).toEqual(['★', '★', '★', '☆', '☆'])
  })

  it('renders all filled for rating 5', () => {
    render(<StarRating rating={5} />)
    expect(stars()).toEqual(['★', '★', '★', '★', '★'])
  })

  it('caps rating > 5 at 5', () => {
    render(<StarRating rating={9} />)
    expect(stars()).toEqual(['★', '★', '★', '★', '★'])
  })

  it('treats negative rating as 0', () => {
    render(<StarRating rating={-3} />)
    expect(stars()).toEqual(['☆', '☆', '☆', '☆', '☆'])
  })

  it('floors non-integer ratings (3.7 -> 3)', () => {
    render(<StarRating rating={3.7} />)
    expect(stars()).toEqual(['★', '★', '★', '☆', '☆'])
  })
})
