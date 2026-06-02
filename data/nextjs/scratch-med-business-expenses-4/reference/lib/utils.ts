import type { Category } from './types'

export const CATEGORIES: Category[] = ['Food', 'Travel', 'Software', 'Office', 'Other']

export function fmt(n: number): string {
  return `$${n.toFixed(2)}`
}
