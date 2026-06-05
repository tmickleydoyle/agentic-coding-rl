import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('decks page', () => {
  it('lists the seeded decks with card counts', () => {
    render(<App />)
    const list = screen.getByTestId('deck-list')
    expect(within(list).getByTestId('deck-d1-name')).toHaveTextContent('Spanish')
    expect(within(list).getByTestId('deck-d2-name')).toHaveTextContent('Capitals')
    expect(screen.getByTestId('deck-d1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('deck-d2-count')).toHaveTextContent('2')
  })

  it('studying a deck navigates to study showing the first card front', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('study-d1'))
    expect(screen.getByTestId('page-study')).toBeInTheDocument()
    expect(screen.getByTestId('card-face')).toHaveTextContent('hola')
    expect(screen.getByTestId('study-card')).toHaveAttribute('data-flipped', 'false')
  })

  it('add-card navigates to the add page for that deck', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d2'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
    expect(screen.getByTestId('card-form')).toBeInTheDocument()
  })
})
