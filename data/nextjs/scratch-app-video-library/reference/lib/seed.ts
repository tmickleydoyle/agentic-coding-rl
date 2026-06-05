import type { Video } from './types'

export function seedVideos(): Video[] {
  return [
    { id: 'v1', title: 'Intro to Hooks', category: 'React', duration: 600 },
    { id: 'v2', title: 'Advanced Generics', category: 'TypeScript', duration: 900 },
    { id: 'v3', title: 'Flexbox Deep Dive', category: 'CSS', duration: 720 },
    { id: 'v4', title: 'Suspense Patterns', category: 'React', duration: 840 },
    { id: 'v5', title: 'Grid Mastery', category: 'CSS', duration: 540 },
  ]
}
