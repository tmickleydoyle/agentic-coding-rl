import { describe, it, expect } from 'vitest'
import {
  emptyBoard,
  winner,
  isFull,
  outcome,
  applyMove,
  aiMove,
} from '../lib/game'
import type { Board } from '../lib/types'

const b = (s: string): Board =>
  s.split('').map((c) => (c === '.' ? null : (c as 'X' | 'O')))

describe('game lib', () => {
  it('emptyBoard is nine nulls', () => {
    expect(emptyBoard()).toEqual([null, null, null, null, null, null, null, null, null])
  })

  it('winner detects a row', () => {
    expect(winner(b('XXX...OO.'))).toBe('X')
  })

  it('winner detects a column', () => {
    expect(winner(b('O..O..O..'))).toBe('O')
  })

  it('winner detects a diagonal', () => {
    expect(winner(b('X...X...X'))).toBe('X')
  })

  it('winner returns null with no line', () => {
    expect(winner(b('XO.......'))).toBeNull()
  })

  it('isFull true only when no empties', () => {
    expect(isFull(b('XOXOXOXOX'))).toBe(true)
    expect(isFull(b('XOXOXOXO.'))).toBe(false)
  })

  it('outcome reports win, draw and in-progress', () => {
    expect(outcome(b('XXX...OO.'))).toBe('X')
    expect(outcome(b('XOXOOXXXO'))).toBe('draw')
    expect(outcome(b('X........'))).toBeNull()
  })

  it('applyMove returns a new board with the mark placed', () => {
    const board = emptyBoard()
    const next = applyMove(board, 0, 'X')
    expect(next[0]).toBe('X')
    expect(next).not.toBe(board)
    expect(board[0]).toBeNull()
  })

  it('applyMove is a no-op (same reference) for occupied or out-of-range', () => {
    const board = applyMove(emptyBoard(), 0, 'X')
    expect(applyMove(board, 0, 'O')).toBe(board)
    expect(applyMove(board, 9, 'O')).toBe(board)
    expect(applyMove(board, -1, 'O')).toBe(board)
  })

  it('aiMove takes a winning move when available', () => {
    // O at 0,1 -> winning at 2
    expect(aiMove(b('OO.......'))).toBe(2)
  })

  it('aiMove blocks an X win when it cannot win itself', () => {
    // X threatens 0,1,2 -> block at 2
    expect(aiMove(b('XX..O....'))).toBe(2)
  })

  it('aiMove prefers the center on an empty board', () => {
    expect(aiMove(emptyBoard())).toBe(4)
  })

  it('aiMove takes the first free corner when center is taken', () => {
    expect(aiMove(b('....X....'))).toBe(0)
  })

  it('aiMove returns -1 on a full board', () => {
    expect(aiMove(b('XOXOXOXOX'))).toBe(-1)
  })
})
