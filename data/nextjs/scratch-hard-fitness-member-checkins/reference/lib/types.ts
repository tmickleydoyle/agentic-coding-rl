export type Route = 'members' | 'checkins' | 'progress' | 'settings'
export type Member = { id: number; name: string; goal: number }
export type CheckIn = { id: number; memberId: number }
