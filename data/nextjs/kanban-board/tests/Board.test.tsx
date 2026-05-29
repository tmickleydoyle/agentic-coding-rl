import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Board from '../components/Board'

const CARDS = [
  { id: 1, title: 'Write spec' },
  { id: 2, title: 'Build feature' },
  { id: 3, title: 'Ship it' },
]

function columnOf(id: number): number {
  for (let i = 0; i < 3; i++) {
    if (within(screen.getByTestId(`column-${i}`)).queryByTestId(`card-${id}`)) return i
  }
  return -1
}

describe('Kanban board', () => {
  it('starts all cards in To Do (column 0)', () => {
    render(<Board initialCards={CARDS} />)
    expect(columnOf(1)).toBe(0)
    expect(columnOf(2)).toBe(0)
    expect(columnOf(3)).toBe(0)
    expect(screen.getByTestId('count-0')).toHaveTextContent('3')
    expect(screen.getByTestId('count-1')).toHaveTextContent('0')
    expect(screen.getByTestId('count-2')).toHaveTextContent('0')
  })

  it('Forward moves a card to the next column', async () => {
    const user = userEvent.setup()
    render(<Board initialCards={CARDS} />)
    await user.click(screen.getByTestId('forward-1'))
    expect(columnOf(1)).toBe(1)
    expect(screen.getByTestId('count-0')).toHaveTextContent('2')
    expect(screen.getByTestId('count-1')).toHaveTextContent('1')
  })

  it('Back moves a card to the previous column', async () => {
    const user = userEvent.setup()
    render(<Board initialCards={CARDS} />)
    await user.click(screen.getByTestId('forward-2'))
    expect(columnOf(2)).toBe(1)
    await user.click(screen.getByTestId('back-2'))
    expect(columnOf(2)).toBe(0)
  })

  it('Back is disabled in To Do and Forward is disabled in Done', async () => {
    const user = userEvent.setup()
    render(<Board initialCards={CARDS} />)
    expect(screen.getByTestId('back-1')).toBeDisabled()
    await user.click(screen.getByTestId('forward-1'))
    await user.click(screen.getByTestId('forward-1'))
    expect(columnOf(1)).toBe(2)
    expect(screen.getByTestId('forward-1')).toBeDisabled()
    expect(screen.getByTestId('back-1')).not.toBeDisabled()
  })

  it('cannot move past Done even with extra clicks', async () => {
    const user = userEvent.setup()
    render(<Board initialCards={CARDS} />)
    await user.click(screen.getByTestId('forward-3'))
    await user.click(screen.getByTestId('forward-3'))
    expect(columnOf(3)).toBe(2)
    await user.click(screen.getByTestId('forward-3'))
    expect(columnOf(3)).toBe(2)
  })

  it('moving one card does not affect others', async () => {
    const user = userEvent.setup()
    render(<Board initialCards={CARDS} />)
    await user.click(screen.getByTestId('forward-2'))
    expect(columnOf(1)).toBe(0)
    expect(columnOf(2)).toBe(1)
    expect(columnOf(3)).toBe(0)
  })

  it('preserves original order within a column', async () => {
    const user = userEvent.setup()
    render(<Board initialCards={CARDS} />)
    await user.click(screen.getByTestId('forward-1'))
    await user.click(screen.getByTestId('forward-3'))
    const col1 = screen.getByTestId('column-1')
    const ids = within(col1)
      .getAllByTestId(/^card-/)
      .map((el) => el.getAttribute('data-testid'))
    expect(ids).toEqual(['card-1', 'card-3'])
  })
})
