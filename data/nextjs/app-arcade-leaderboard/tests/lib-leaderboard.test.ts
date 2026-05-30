import { describe, it, expect } from 'vitest'
import {
  rankScores,
  scoresForGame,
  topScore,
  playerCount,
} from '../lib/leaderboard'
import type { Score } from '../lib/types'

const data: Score[] = [
  { id: 's1', gameId: 'g1', player: 'Ada', points: 1200 },
  { id: 's2', gameId: 'g1', player: 'Bo', points: 900 },
  { id: 's3', gameId: 'g1', player: 'Cy', points: 1500 },
  { id: 's4', gameId: 'g2', player: 'Ada', points: 300 },
  { id: 's5', gameId: 'g2', player: 'Di', points: 500 },
]

describe('leaderboard lib', () => {
  it('rankScores sorts by points descending', () => {
    expect(rankScores(data).map((s) => s.id)).toEqual(['s3', 's1', 's2', 's5', 's4'])
  })

  it('rankScores does not mutate the input', () => {
    const copy = data.slice()
    rankScores(data)
    expect(data).toEqual(copy)
  })

  it('rankScores is stable for ties', () => {
    const tied: Score[] = [
      { id: 'a', gameId: 'g', player: 'P', points: 10 },
      { id: 'b', gameId: 'g', player: 'Q', points: 10 },
      { id: 'c', gameId: 'g', player: 'R', points: 10 },
    ]
    expect(rankScores(tied).map((s) => s.id)).toEqual(['a', 'b', 'c'])
  })

  it('scoresForGame filters and ranks', () => {
    expect(scoresForGame(data, 'g1').map((s) => s.id)).toEqual(['s3', 's1', 's2'])
  })

  it('topScore returns the highest for a game', () => {
    expect(topScore(data, 'g1')?.id).toBe('s3')
  })

  it('topScore returns null for a game with no scores', () => {
    expect(topScore(data, 'g9')).toBeNull()
  })

  it('playerCount counts distinct players', () => {
    expect(playerCount(data)).toBe(4)
  })
})
