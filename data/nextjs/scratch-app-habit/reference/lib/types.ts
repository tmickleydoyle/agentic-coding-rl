export type Route = 'today' | 'weekly' | 'stats' | 'settings'
export type Habit = { id: number; name: string; days: boolean[] }

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const TODAY = DAYS.length - 1 // Sun

export function stats(days: boolean[]) {
  const done = days.filter(Boolean).length
  const pct = Math.round((done / DAYS.length) * 100)
  let cur = 0
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]) cur++
    else break
  }
  let lon = 0
  let run = 0
  days.forEach((d) => {
    if (d) {
      run++
      if (run > lon) lon = run
    } else {
      run = 0
    }
  })
  return { cur, lon, pct }
}
