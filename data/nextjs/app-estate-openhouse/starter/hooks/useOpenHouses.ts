'use client'
import { useApp } from '../components/AppStateProvider'
import type { House } from '../lib/types'

export function countVisitors(_house: House): number {
  // TODO: return the house's visitor count
  return 0
}

export function avgRating(_house: House): number {
  // TODO: mean rating over feedback, rounded to one decimal (0 when none)
  return 0
}

export type Totals = {
  houses: number
  visitors: number
  feedback: number
}

export function useOpenHouses() {
  const { houses } = useApp()
  const visitorCount = (house: House): number => countVisitors(house)
  const feedbackCount = (house: House): number => house.feedback.length
  const averageRating = (house: House): number => avgRating(house)
  const totals: Totals = { houses: houses.length, visitors: 0, feedback: 0 }
  return { visitorCount, feedbackCount, averageRating, totals }
}
