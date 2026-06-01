import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function studySpanish(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('study-d1'))
}

describe('study flow', () => {
  it('flips a card to show its back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await studySpanish(user)
    expect(screen.getByTestId('card-face')).toHaveTextContent('hola')
    await user.click(screen.getByTestId('flip-card'))
    expect(screen.getByTestId('study-card')).toHaveAttribute('data-flipped', 'true')
    expect(screen.getByTestId('card-face')).toHaveTextContent('hello')
  })

  it('shows initial progress from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await studySpanish(user)
    // Spanish has c1 (unknown) + c2 (known) => 1/2
    expect(screen.getByTestId('study-progress')).toHaveTextContent('1/2')
  })

  it('marking the current card known updates progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await studySpanish(user)
    await user.click(screen.getByTestId('mark-known'))
    expect(screen.getByTestId('study-progress')).toHaveTextContent('2/2')
  })

  it('advances to the next card and resets the flip', async () => {
    const user = userEvent.setup()
    render(<App />)
    await studySpanish(user)
    await user.click(screen.getByTestId('flip-card'))
    expect(screen.getByTestId('study-card')).toHaveAttribute('data-flipped', 'true')
    await user.click(screen.getByTestId('next-card'))
    expect(screen.getByTestId('card-face')).toHaveTextContent('gato')
    expect(screen.getByTestId('study-card')).toHaveAttribute('data-flipped', 'false')
  })

  it('next-card clamps at the last card', async () => {
    const user = userEvent.setup()
    render(<App />)
    await studySpanish(user)
    await user.click(screen.getByTestId('next-card'))
    await user.click(screen.getByTestId('next-card'))
    await user.click(screen.getByTestId('next-card'))
    expect(screen.getByTestId('card-face')).toHaveTextContent('gato')
  })

  it('marking unknown lowers progress again', async () => {
    const user = userEvent.setup()
    render(<App />)
    await studySpanish(user)
    await user.click(screen.getByTestId('next-card')) // move to c2 (known)
    await user.click(screen.getByTestId('mark-unknown'))
    expect(screen.getByTestId('study-progress')).toHaveTextContent('0/2')
  })

  it('adding a card then studying shows it in the deck', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d2'))
    await user.type(screen.getByTestId('front-input'), 'Italy')
    await user.type(screen.getByTestId('back-input'), 'Rome')
    await user.click(screen.getByTestId('save-card'))
    expect(screen.getByTestId('page-study')).toBeInTheDocument()
    // progress total should now be 3 for Capitals (France, Japan, Italy)
    expect(screen.getByTestId('study-progress')).toHaveTextContent('0/3')
  })

  it('blocks adding a card with a blank side', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d1'))
    await user.type(screen.getByTestId('front-input'), 'only front')
    await user.click(screen.getByTestId('save-card'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })
})
