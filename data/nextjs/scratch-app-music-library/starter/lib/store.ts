import { Track, QueueItem } from './types'
export function getTracks(): Track[] { return [] }
export function addTrack(_d: Omit<Track, 'id'>): Track { return { id: '', title: '', artist: '', album: '', duration: 0 } }
export function getQueue(): QueueItem[] { return [] }
export function addToQueue(_trackId: string): QueueItem { return { id: '', trackId: '' } }
export function removeFromQueue(_id: string): boolean { return false }
export function __reset(): void {}
