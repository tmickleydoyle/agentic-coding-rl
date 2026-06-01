import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add-card + stats', () => {
  it('blocks submitting a card with empty fields', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-card'))
    await user.click(screen.getByTestId('submit-card'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-card')).toBeInTheDocument()
  })

  it('adds a card and returns to decks where the total grows', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-card'))
    await user.selectOptions(screen.getByTestId('deck-select'), 'd2')
    await user.type(screen.getByTestId('front-input'), 'Spain')
    await user.type(screen.getByTestId('back-input'), 'Madrid')
    await user.click(screen.getByTestId('submit-card'))
    expect(screen.getByTestId('page-decks')).toBeInTheDocument()
    expect(screen.getByTestId('deck-d2-total')).toHaveTextContent('2')
    // new card is due today
    expect(screen.getByTestId('deck-d2-due')).toHaveTextContent('2')
  })

  it('stats aggregate totals and due counts across decks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('total-cards-value')).toHaveTextContent('4')
    // 2 due in d1 + 1 due in d2 = 3
    expect(screen.getByTestId('due-today-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-deck-d1-due')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-deck-d2-due')).toHaveTextContent('1')
  })

  it('stats reflect a graded card moving out of due', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('review-d1'))
    await user.click(screen.getByTestId('grade-easy'))
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('due-today-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-deck-d1-due')).toHaveTextContent('1')
  })
})
