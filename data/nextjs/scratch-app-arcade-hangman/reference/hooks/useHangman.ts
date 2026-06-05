'use client'
import { useApp } from '../components/AppStateProvider'
import { isOver, masked, remaining } from '../lib/hangman'

export function useHangman() {
  const { game } = useApp()
  return {
    masked: masked(game),
    remaining: remaining(game),
    status: game.status,
    guessed: game.guessed,
    over: isOver(game),
  }
}
