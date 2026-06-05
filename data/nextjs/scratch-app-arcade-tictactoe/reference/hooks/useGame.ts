'use client'
import { useApp } from '../components/AppStateProvider'

export function useGame() {
  const { board, result, current, tally } = useApp()
  let moves = 0
  board.forEach((c) => {
    if (c !== null) moves += 1
  })
  return { board, result, current, tally, moves }
}
