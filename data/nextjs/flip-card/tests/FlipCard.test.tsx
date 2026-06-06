import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlipCard from '../components/FlipCard'

describe('FlipCard', () => {
  it('shows front face initially', () => {
    render(<FlipCard />)
    expect(screen.getByTestId('front-face')).toHaveTextContent('Front')
  })

  it('does not show back face initially', () => {
    render(<FlipCard />)
    expect(screen.queryByTestId('back-face')).toBeNull()
  })

  it('shows back face after flip', async () => {
    const user = userEvent.setup()
    render(<FlipCard />)
    await user.click(screen.getByTestId('flip-btn'))
    expect(screen.getByTestId('back-face')).toHaveTextContent('Back')
  })

  it('hides front face after flip', async () => {
    const user = userEvent.setup()
    render(<FlipCard />)
    await user.click(screen.getByTestId('flip-btn'))
    expect(screen.queryByTestId('front-face')).toBeNull()
  })

  it('flips back to front on second click', async () => {
    const user = userEvent.setup()
    render(<FlipCard />)
    await user.click(screen.getByTestId('flip-btn'))
    await user.click(screen.getByTestId('flip-btn'))
    expect(screen.getByTestId('front-face')).toHaveTextContent('Front')
    expect(screen.queryByTestId('back-face')).toBeNull()
  })

  it('renders flip button', () => {
    render(<FlipCard />)
    expect(screen.getByTestId('flip-btn')).toHaveTextContent('Flip')
  })
})
