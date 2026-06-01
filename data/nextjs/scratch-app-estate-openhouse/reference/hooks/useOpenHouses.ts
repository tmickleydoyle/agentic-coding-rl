'use client'
import { useApp } from '../components/AppStateProvider'
import type { House } from '../lib/types'

export function countVisitors(house: House): number {
  return house.visitors.length
}

export function avgRating(house: House): number {
  if (house.feedback.length === 0) return 0
  const sum = house.feedback.reduce((s, f) => s + f.rating, 0)
  return Math.round((sum / house.feedback.length) * 10) / 10
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
  const totals: Totals = {
    houses: houses.length,
    visitors: houses.reduce((s, h) => s + h.visitors.length, 0),
    feedback: houses.reduce((s, h) => s + h.feedback.length, 0),
  }
  return { visitorCount, feedbackCount, averageRating, totals }
}
