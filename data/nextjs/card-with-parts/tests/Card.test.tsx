import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../components/Card'

describe('Card', () => {
  it('renders header + body + footer when action is given', () => {
    render(<Card title="Hello" body="content here" action="Click" />)
    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByTestId('card-header')).toHaveTextContent('Hello')
    expect(screen.getByTestId('card-body')).toHaveTextContent('content here')
    expect(screen.getByTestId('card-footer')).toBeInTheDocument()
    expect(screen.getByTestId('card-action')).toHaveTextContent('Click')
  })

  it('omits the footer when no action prop is provided', () => {
    render(<Card title="X" body="Y" />)
    expect(screen.getByTestId('card-header')).toHaveTextContent('X')
    expect(screen.getByTestId('card-body')).toHaveTextContent('Y')
    expect(screen.queryByTestId('card-footer')).toBeNull()
    expect(screen.queryByTestId('card-action')).toBeNull()
  })

  it('uses the sub-components (header/body/footer testids are inside the card)', () => {
    render(<Card title="t" body="b" action="a" />)
    const card = screen.getByTestId('card')
    // sub-component testids should all be DESCENDANTS of the card wrapper
    expect(card.contains(screen.getByTestId('card-header'))).toBe(true)
    expect(card.contains(screen.getByTestId('card-body'))).toBe(true)
    expect(card.contains(screen.getByTestId('card-footer'))).toBe(true)
  })
})
