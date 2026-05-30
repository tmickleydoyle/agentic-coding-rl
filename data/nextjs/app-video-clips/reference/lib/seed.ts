import type { Clip } from './types'

export function seedClips(): Clip[] {
  return [
    { id: 'c1', title: 'Quick Tip', category: 'Tips', likes: 10 },
    { id: 'c2', title: 'Funny Cat', category: 'Fun', likes: 42 },
    { id: 'c3', title: 'Code Trick', category: 'Tips', likes: 7 },
    { id: 'c4', title: 'Dance Move', category: 'Fun', likes: 30 },
    { id: 'c5', title: 'Life Hack', category: 'Tips', likes: 15 },
  ]
}
