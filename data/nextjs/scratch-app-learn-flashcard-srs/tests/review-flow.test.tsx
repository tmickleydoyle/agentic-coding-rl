import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function reviewD1(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('review-d1'))
}

describe('review flow', () => {
  it('hides the back until show-back is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reviewD1(user)
    expect(screen.queryByTestId('card-back')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('show-back'))
    expect(screen.getByTestId('card-back')).toHaveTextContent('hello')
  })

  it('grading easy advances to the next due card', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reviewD1(user)
    expect(screen.getByTestId('card-front')).toHaveTextContent('hola')
    await user.click(screen.getByTestId('grade-easy'))
    // hola rescheduled away; next due card is gato
    expect(screen.getByTestId('card-front')).toHaveTextContent('gato')
  })

  it('grading hard also advances and reschedules to tomorrow', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reviewD1(user)
    await user.click(screen.getByTestId('grade-hard'))
    expect(screen.getByTestId('card-front')).toHaveTextContent('gato')
  })

  it('hides the back again after grading', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reviewD1(user)
    await user.click(screen.getByTestId('show-back'))
    expect(screen.getByTestId('card-back')).toBeInTheDocument()
    await user.click(screen.getByTestId('grade-easy'))
    expect(screen.queryByTestId('card-back')).not.toBeInTheDocument()
  })

  it('shows all-done after grading every due card', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reviewD1(user)
    await user.click(screen.getByTestId('grade-easy')) // hola
    await user.click(screen.getByTestId('grade-easy')) // gato
    expect(screen.getByTestId('all-done')).toBeInTheDocument()
    expect(screen.queryByTestId('current-card')).not.toBeInTheDocument()
  })

  it('reviewing a single-card deck shows all-done after one grade', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('review-d2'))
    expect(screen.getByTestId('card-front')).toHaveTextContent('France')
    await user.click(screen.getByTestId('grade-hard'))
    expect(screen.getByTestId('all-done')).toBeInTheDocument()
  })

  it('grading updates the due count on the decks page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await reviewD1(user)
    await user.click(screen.getByTestId('grade-easy')) // hola away
    await user.click(screen.getByTestId('nav-decks'))
    expect(screen.getByTestId('deck-d1-due')).toHaveTextContent('1')
    expect(screen.getByTestId('deck-d1-total')).toHaveTextContent('3')
  })
})
