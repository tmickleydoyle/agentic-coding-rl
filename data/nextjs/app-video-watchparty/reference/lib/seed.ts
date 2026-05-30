import type { Party } from './types'

export function seedParties(): Party[] {
  return [
    { id: 'p1', title: 'React Conf Replay', time: 150, rsvped: false, queue: [] },
    { id: 'p2', title: 'Design Systems Live', time: 80, rsvped: false, queue: ['Intro'] },
    { id: 'p3', title: 'CSS Showcase', time: 200, rsvped: false, queue: [] },
  ]
}
