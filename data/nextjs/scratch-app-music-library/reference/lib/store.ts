import { Track, QueueItem } from './types'

const SEED_TRACKS: Track[] = [
  { id: 't1', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: 354 },
  { id: 't2', title: 'Under Pressure', artist: 'Queen', album: 'Hot Space', duration: 248 },
  { id: 't3', title: 'Heroes', artist: 'David Bowie', album: 'Heroes', duration: 370 },
  { id: 't4', title: "Let's Dance", artist: 'David Bowie', album: "Let's Dance", duration: 458 },
  { id: 't5', title: 'Roxanne', artist: 'The Police', album: "Outlandos d'Amour", duration: 190 },
]

const SEED_QUEUE: QueueItem[] = [
  { id: 'q1', trackId: 't1' },
  { id: 'q2', trackId: 't3' },
]

let tracks: Track[] = SEED_TRACKS.map(t => ({ ...t }))
let queue: QueueItem[] = SEED_QUEUE.map(q => ({ ...q }))

export function getTracks(): Track[] { return [...tracks] }

export function addTrack(data: Omit<Track, 'id'>): Track {
  const t: Track = { id: `t${Date.now()}`, ...data }
  tracks.push(t)
  return t
}

export function getQueue(): QueueItem[] { return [...queue] }

export function addToQueue(trackId: string): QueueItem {
  const item: QueueItem = { id: `q${Date.now()}`, trackId }
  queue.push(item)
  return item
}

export function removeFromQueue(id: string): boolean {
  const before = queue.length
  queue = queue.filter(q => q.id !== id)
  return queue.length < before
}

export function __reset(): void {
  tracks = SEED_TRACKS.map(t => ({ ...t }))
  queue = SEED_QUEUE.map(q => ({ ...q }))
}
