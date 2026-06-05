'use client'
import { usePlatform } from '../hooks/usePlatform'

export function Quality() {
  const { features, bugs } = usePlatform()

  const openCount = (fid: number) =>
    bugs.filter((b) => b.featureId === fid && b.open).length
  const totalCount = (fid: number) => bugs.filter((b) => b.featureId === fid).length
  const atRisk = (fid: number) =>
    bugs.some((b) => b.featureId === fid && b.open && b.severity === 'high')

  const totalOpen = bugs.filter((b) => b.open).length

  let healthiest = 'none'
  if (features.length > 0) {
    let best = features[0]
    let bestOpen = openCount(best.id)
    for (let i = 1; i < features.length; i++) {
      const o = openCount(features[i].id)
      if (o < bestOpen) {
        best = features[i]
        bestOpen = o
      }
    }
    healthiest = best.name
  }

  return (
    <section aria-label="Quality view">
      <h1>Quality</h1>
      {features.map((f) => (
        <div key={f.id}>
          <span>{`${f.name}: ${openCount(f.id)} open / ${totalCount(f.id)} total`}</span>
          {atRisk(f.id) && <span>at risk</span>}
        </div>
      ))}
      <p>{`Open bugs: ${totalOpen}`}</p>
      <p>{`Healthiest feature: ${healthiest}`}</p>
    </section>
  )
}
