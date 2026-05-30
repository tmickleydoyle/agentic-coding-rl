import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('decks list', () => {
  it('lists decks with due and total counts', () => {
    render(<App />)
    const list = screen.getByTestId('deck-list')
    expect(within(list).getByTestId('deck-d1-name')).toHaveTextContent('Spanish')
    // d1 has 3 cards, 2 due today (d1-c3 due day 3)
    expect(within(list).getByTestId('deck-d1-due')).toHaveTextContent('2')
    expect(within(list).getByTestId('deck-d1-total')).toHaveTextContent('3')
    expect(within(list).getByTestId('deck-d2-due')).toHaveTextContent('1')
    expect(within(list).getByTestId('deck-d2-total')).toHaveTextContent('1')
  })

  it('opening a deck navigates to review with the first due card', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('review-d1'))
    expect(screen.getByTestId('page-review')).toBeInTheDocument()
    expect(screen.getByTestId('card-front')).toHaveTextContent('hola')
  })
})
