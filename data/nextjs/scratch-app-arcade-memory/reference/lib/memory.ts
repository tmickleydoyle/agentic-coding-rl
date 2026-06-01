import type { Card, Game } from './types'

// Pure memory-match logic. No React, no timers. Unit-tested directly.

export function buildDeck(symbols: string[]): Card[] {
  const doubled = symbols.concat(symbols)
  return doubled.map((symbol, i) => ({
    id: `c${i}`,
    symbol,
    faceUp: false,
    matched: false,
  }))
}

export function newGame(symbols: string[]): Game {
  return { cards: buildDeck(symbols), moves: 0, matches: 0, firstPick: null }
}

function faceUpUnmatched(cards: Card[]): Card[] {
  return cards.filter((c) => c.faceUp && !c.matched)
}

export function flip(game: Game, id: string): Game {
  const card = game.cards.find((c) => c.id === id)
  if (!card || card.matched || card.faceUp) return game
  // pending mismatch: two unmatched cards already face up
  if (faceUpUnmatched(game.cards).length >= 2) return game

  if (game.firstPick === null) {
    return {
      ...game,
      firstPick: id,
      cards: game.cards.map((c) => (c.id === id ? { ...c, faceUp: true } : c)),
    }
  }

  const first = game.cards.find((c) => c.id === game.firstPick)
  const isMatch = first ? first.symbol === card.symbol : false
  const cards = game.cards.map((c) => {
    if (c.id === id) return { ...c, faceUp: true, matched: isMatch }
    if (c.id === game.firstPick) return { ...c, matched: isMatch }
    return c
  })
  return {
    ...game,
    cards,
    firstPick: null,
    moves: game.moves + 1,
    matches: isMatch ? game.matches + 1 : game.matches,
  }
}

export function clearMismatch(game: Game): Game {
  const lingering = faceUpUnmatched(game.cards)
  if (lingering.length < 2) return game
  return {
    ...game,
    cards: game.cards.map((c) => (c.matched ? c : { ...c, faceUp: false })),
  }
}

export function isWon(game: Game): boolean {
  return game.cards.length > 0 && game.cards.every((c) => c.matched)
}

export function bestScore(prev: number | null, moves: number): number {
  if (prev === null) return moves
  return Math.min(prev, moves)
}
