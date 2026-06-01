import type { HangmanState, Status } from './types'

// Pure hangman logic. No React. Unit-tested directly.

export function newState(word: string, maxWrong = 6): HangmanState {
  return {
    word: word.toLowerCase(),
    guessed: [],
    wrong: 0,
    maxWrong,
    status: 'playing',
  }
}

function isLetter(letter: string): boolean {
  return letter.length === 1 && letter >= 'a' && letter <= 'z'
}

function computeStatus(word: string, guessed: string[], wrong: number, maxWrong: number): Status {
  if (wrong >= maxWrong) return 'lost'
  const allFound = word.split('').every((ch) => guessed.indexOf(ch) !== -1)
  return allFound ? 'won' : 'playing'
}

export function guess(state: HangmanState, letter: string): HangmanState {
  if (state.status !== 'playing') return state
  const l = letter.toLowerCase()
  if (!isLetter(l)) return state
  if (state.guessed.indexOf(l) !== -1) return state
  const guessed = state.guessed.concat(l)
  const wrong = state.word.indexOf(l) === -1 ? state.wrong + 1 : state.wrong
  return {
    ...state,
    guessed,
    wrong,
    status: computeStatus(state.word, guessed, wrong, state.maxWrong),
  }
}

export function masked(state: HangmanState): string {
  if (state.status === 'lost') return state.word
  return state.word
    .split('')
    .map((ch) => (state.guessed.indexOf(ch) !== -1 ? ch : '_'))
    .join('')
}

export function remaining(state: HangmanState): number {
  return state.maxWrong - state.wrong
}

export function isOver(state: HangmanState): boolean {
  return state.status === 'won' || state.status === 'lost'
}
