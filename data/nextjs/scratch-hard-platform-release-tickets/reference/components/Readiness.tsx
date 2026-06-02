'use client'
import { usePlatform } from '../hooks/usePlatform'

export function Readiness() {
  const { releases, tickets } = usePlatform()

  const forRelease = (rid: number) => tickets.filter((t) => t.releaseId === rid)
  const donePts = (rid: number) =>
    forRelease(rid).filter((t) => t.done).reduce((s, t) => s + t.points, 0)
  const totalPts = (rid: number) => forRelease(rid).reduce((s, t) => s + t.points, 0)
  const openPts = (rid: number) =>
    forRelease(rid).filter((t) => !t.done).reduce((s, t) => s + t.points, 0)
  const ready = (rid: number) => {
    const ts = forRelease(rid)
    return ts.length > 0 && ts.every((t) => t.done)
  }

  const totalOpen = tickets.filter((t) => !t.done).reduce((s, t) => s + t.points, 0)

  let next = 'none'
  let bestOpen = 0
  for (let i = 0; i < releases.length; i++) {
    const o = openPts(releases[i].id)
    if (o > bestOpen) {
      bestOpen = o
      next = releases[i].name
    }
  }

  return (
    <section aria-label="Readiness view">
      <h1>Readiness</h1>
      {releases.map((r) => (
        <div key={r.id}>
          <span>{`${r.name}: ${donePts(r.id)}/${totalPts(r.id)} pts done`}</span>
          {ready(r.id) && <span>ready to ship</span>}
        </div>
      ))}
      <p>{`Open points: ${totalOpen}`}</p>
      <p>{`Next release: ${next}`}</p>
    </section>
  )
}
