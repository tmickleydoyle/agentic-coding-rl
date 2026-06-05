import { describe, it, expect } from 'vitest'
import {
  buildDeck,
  newGame,
  flip,
  clearMismatch,
  isWon,
  bestScore,
} from '../lib/memory'

describe('memory lib', () => {
  it('buildDeck doubles symbols with index ids', () => {
    const deck = buildDeck(['A', 'B'])
    expect(deck.map((c) => c.id)).toEqual(['c0', 'c1', 'c2', 'c3'])
    expect(deck.map((c) => c.symbol)).toEqual(['A', 'B', 'A', 'B'])
    expect(deck.every((c) => !c.faceUp && !c.matched)).toBe(true)
  })

  it('newGame builds a fresh game', () => {
    const g = newGame(['A', 'B'])
    expect(g.moves).toBe(0)
    expect(g.matches).toBe(0)
    expect(g.firstPick).toBeNull()
    expect(g.cards.length).toBe(4)
  })

  it('first flip records firstPick without a move', () => {
    const g = flip(newGame(['A', 'B']), 'c0')
    expect(g.firstPick).toBe('c0')
    expect(g.moves).toBe(0)
    expect(g.cards.find((c) => c.id === 'c0')?.faceUp).toBe(true)
  })

  it('matching second flip marks both matched and counts a move', () => {
    // ['A','B'] -> c0=A, c2=A is the matching pair
    let g = newGame(['A', 'B'])
    g = flip(g, 'c0')
    g = flip(g, 'c2')
    expect(g.moves).toBe(1)
    expect(g.matches).toBe(1)
    expect(g.firstPick).toBeNull()
    expect(g.cards.find((c) => c.id === 'c0')?.matched).toBe(true)
    expect(g.cards.find((c) => c.id === 'c2')?.matched).toBe(true)
  })

  it('mismatched second flip leaves both face up and unmatched', () => {
    let g = newGame(['A', 'B'])
    g = flip(g, 'c0') // A
    g = flip(g, 'c1') // B
    expect(g.moves).toBe(1)
    expect(g.matches).toBe(0)
    const c0 = g.cards.find((c) => c.id === 'c0')
    const c1 = g.cards.find((c) => c.id === 'c1')
    expect(c0?.faceUp).toBe(true)
    expect(c0?.matched).toBe(false)
    expect(c1?.faceUp).toBe(true)
  })

  it('a third flip during a pending mismatch is ignored', () => {
    let g = newGame(['A', 'B'])
    g = flip(g, 'c0')
    g = flip(g, 'c1')
    const after = flip(g, 'c2')
    expect(after).toBe(g)
  })

  it('clearMismatch flips lingering unmatched cards back down', () => {
    let g = newGame(['A', 'B'])
    g = flip(g, 'c0')
    g = flip(g, 'c1')
    g = clearMismatch(g)
    expect(g.cards.find((c) => c.id === 'c0')?.faceUp).toBe(false)
    expect(g.cards.find((c) => c.id === 'c1')?.faceUp).toBe(false)
  })

  it('clearMismatch keeps matched cards up and is a no-op when nothing lingers', () => {
    let g = newGame(['A', 'B'])
    g = flip(g, 'c0')
    g = flip(g, 'c2') // match
    const same = clearMismatch(g)
    expect(same).toBe(g)
    expect(g.cards.find((c) => c.id === 'c0')?.faceUp).toBe(true)
  })

  it('flip ignores unknown, matched or already face-up cards', () => {
    let g = newGame(['A', 'B'])
    expect(flip(g, 'zzz')).toBe(g)
    g = flip(g, 'c0')
    expect(flip(g, 'c0')).toBe(g)
  })

  it('isWon is true only when all cards are matched', () => {
    let g = newGame(['A', 'B'])
    expect(isWon(g)).toBe(false)
    g = flip(g, 'c0')
    g = flip(g, 'c2') // A pair
    g = flip(g, 'c1')
    g = flip(g, 'c3') // B pair
    expect(isWon(g)).toBe(true)
  })

  it('bestScore keeps the lower value', () => {
    expect(bestScore(null, 10)).toBe(10)
    expect(bestScore(8, 10)).toBe(8)
    expect(bestScore(12, 10)).toBe(10)
  })
})
