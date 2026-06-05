import { describe, it, expect } from 'vitest'
import {
  newState,
  guess,
  masked,
  remaining,
  isOver,
} from '../lib/hangman'

describe('hangman lib', () => {
  it('newState lowercases the word and starts playing', () => {
    const s = newState('Cat')
    expect(s.word).toBe('cat')
    expect(s.guessed).toEqual([])
    expect(s.wrong).toBe(0)
    expect(s.maxWrong).toBe(6)
    expect(s.status).toBe('playing')
  })

  it('a correct guess does not increment wrong', () => {
    const s = guess(newState('cat'), 'c')
    expect(s.guessed).toEqual(['c'])
    expect(s.wrong).toBe(0)
    expect(s.status).toBe('playing')
  })

  it('a wrong guess increments wrong', () => {
    const s = guess(newState('cat'), 'z')
    expect(s.wrong).toBe(1)
    expect(remaining(s)).toBe(5)
  })

  it('guessing all letters wins', () => {
    let s = newState('cat')
    s = guess(s, 'c')
    s = guess(s, 'a')
    s = guess(s, 't')
    expect(s.status).toBe('won')
    expect(isOver(s)).toBe(true)
  })

  it('six wrong guesses loses', () => {
    let s = newState('cat')
    for (const l of ['b', 'd', 'e', 'f', 'g', 'h']) {
      s = guess(s, l)
    }
    expect(s.wrong).toBe(6)
    expect(s.status).toBe('lost')
    expect(isOver(s)).toBe(true)
  })

  it('ignores repeated guesses (same reference)', () => {
    const s = guess(newState('cat'), 'c')
    expect(guess(s, 'c')).toBe(s)
  })

  it('ignores non-letter and multi-char guesses (same reference)', () => {
    const s = newState('cat')
    expect(guess(s, '1')).toBe(s)
    expect(guess(s, 'ab')).toBe(s)
    expect(guess(s, '')).toBe(s)
  })

  it('ignores guesses once the game is over (same reference)', () => {
    let s = newState('cat')
    s = guess(s, 'c')
    s = guess(s, 'a')
    s = guess(s, 't') // won
    expect(guess(s, 'b')).toBe(s)
  })

  it('masked shows underscores for un-guessed letters', () => {
    let s = newState('cat')
    s = guess(s, 'c')
    s = guess(s, 't')
    expect(masked(s)).toBe('c_t')
  })

  it('masked reveals the whole word on a loss', () => {
    let s = newState('cat')
    for (const l of ['b', 'd', 'e', 'f', 'g', 'h']) {
      s = guess(s, l)
    }
    expect(masked(s)).toBe('cat')
  })

  it('repeated letters in a word are revealed together', () => {
    let s = newState('banana')
    s = guess(s, 'a')
    expect(masked(s)).toBe('_a_a_a')
  })
})
