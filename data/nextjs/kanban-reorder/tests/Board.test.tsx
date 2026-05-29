import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Board from '../components/Board'
import { findCard, reorder } from '../lib/reorder'
import type { Board as BoardState } from '../components/types'

function makeBoard(): BoardState {
  return {
    columns: [
      { id: 'todo', title: 'To Do' },
      { id: 'doing', title: 'Doing' },
      { id: 'done', title: 'Done' },
    ],
    cards: {
      todo: [
        { id: 'a', title: 'A' },
        { id: 'b', title: 'B' },
        { id: 'c', title: 'C' },
      ],
      doing: [{ id: 'd', title: 'D' }],
      done: [],
    },
  }
}

function colOrder(colId: string): string[] {
  const col = screen.getByTestId(`col-${colId}`)
  return within(col)
    .queryAllByTestId(/^card-/)
    .map((el) => el.getAttribute('data-testid')!.slice('card-'.length))
}

describe('reorder (pure)', () => {
  it('findCard locates a card by id', () => {
    const b = makeBoard()
    expect(findCard(b, 'b')).toEqual({ columnId: 'todo', index: 1 })
    expect(findCard(b, 'd')).toEqual({ columnId: 'doing', index: 0 })
    expect(findCard(b, 'zzz')).toBeNull()
  })

  it('moves a card down by one within a column (index-shift correct)', () => {
    const b = makeBoard()
    // move 'a' (index 0) to land at index 1 -> pass toIndex 2 (pre-removal)
    const next = reorder(b, 'a', 'todo', 2)
    expect(next.cards.todo.map((c) => c.id)).toEqual(['b', 'a', 'c'])
  })

  it('moves a card up by one within a column', () => {
    const b = makeBoard()
    // move 'c' (index 2) to index 1
    const next = reorder(b, 'c', 'todo', 1)
    expect(next.cards.todo.map((c) => c.id)).toEqual(['a', 'c', 'b'])
  })

  it('moves a card to another column at a given index', () => {
    const b = makeBoard()
    const next = reorder(b, 'b', 'doing', 0)
    expect(next.cards.todo.map((c) => c.id)).toEqual(['a', 'c'])
    expect(next.cards.doing.map((c) => c.id)).toEqual(['b', 'd'])
  })

  it('does not mutate the original board', () => {
    const b = makeBoard()
    const snapshot = JSON.stringify(b)
    reorder(b, 'a', 'done', 0)
    expect(JSON.stringify(b)).toBe(snapshot)
  })

  it('returns the board unchanged for unknown card or column', () => {
    const b = makeBoard()
    expect(reorder(b, 'zzz', 'todo', 0)).toBe(b)
    expect(reorder(b, 'a', 'nope', 0)).toBe(b)
  })
})

describe('Board component', () => {
  it('renders columns with cards and counts', () => {
    render(<Board initial={makeBoard()} />)
    expect(colOrder('todo')).toEqual(['a', 'b', 'c'])
    expect(screen.getByTestId('count-todo')).toHaveTextContent('3')
    expect(screen.getByTestId('count-done')).toHaveTextContent('0')
  })

  it('down then up returns a card to its place', async () => {
    const user = userEvent.setup()
    render(<Board initial={makeBoard()} />)
    await user.click(screen.getByTestId('down-a'))
    expect(colOrder('todo')).toEqual(['b', 'a', 'c'])
    await user.click(screen.getByTestId('up-a'))
    expect(colOrder('todo')).toEqual(['a', 'b', 'c'])
  })

  it('up at the top and down at the bottom are no-ops', async () => {
    const user = userEvent.setup()
    render(<Board initial={makeBoard()} />)
    await user.click(screen.getByTestId('up-a'))
    expect(colOrder('todo')).toEqual(['a', 'b', 'c'])
    await user.click(screen.getByTestId('down-c'))
    expect(colOrder('todo')).toEqual(['a', 'b', 'c'])
  })

  it('moving right appends to the next column and updates counts', async () => {
    const user = userEvent.setup()
    render(<Board initial={makeBoard()} />)
    await user.click(screen.getByTestId('right-b'))
    expect(colOrder('todo')).toEqual(['a', 'c'])
    expect(colOrder('doing')).toEqual(['d', 'b'])
    expect(screen.getByTestId('count-todo')).toHaveTextContent('2')
    expect(screen.getByTestId('count-doing')).toHaveTextContent('2')
  })

  it('moving left at the first column is a no-op; moving right past the last is too', async () => {
    const user = userEvent.setup()
    render(<Board initial={makeBoard()} />)
    await user.click(screen.getByTestId('left-a')) // already leftmost
    expect(colOrder('todo')).toEqual(['a', 'b', 'c'])
    await user.click(screen.getByTestId('right-d')) // d in doing -> done
    expect(colOrder('done')).toEqual(['d'])
    await user.click(screen.getByTestId('right-d')) // done is last -> no-op
    expect(colOrder('done')).toEqual(['d'])
  })

  it('a card can traverse all the way across columns', async () => {
    const user = userEvent.setup()
    render(<Board initial={makeBoard()} />)
    await user.click(screen.getByTestId('right-a')) // todo -> doing
    expect(colOrder('doing')).toEqual(['d', 'a'])
    await user.click(screen.getByTestId('right-a')) // doing -> done
    expect(colOrder('done')).toEqual(['a'])
    expect(colOrder('todo')).toEqual(['b', 'c'])
  })
})
