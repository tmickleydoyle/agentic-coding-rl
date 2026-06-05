'use client'
import { useApp } from '../hooks/useApp'

export function Stats() {
  const { assets } = useApp()
  const total = assets.length
  const logos = assets.filter((a) => a.type === 'logo').length
  const icons = assets.filter((a) => a.type === 'icon').length
  const photos = assets.filter((a) => a.type === 'photo').length

  let topType = 'none'
  if (total > 0) {
    const counts: [string, number][] = [['logo', logos], ['icon', icons], ['photo', photos]]
    let best = -1
    counts.forEach(([t, c]) => {
      if (c > best) {
        best = c
        topType = t
      }
    })
  }

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total assets: ${total}`}</p>
      <p>{`Logos: ${logos}`}</p>
      <p>{`Icons: ${icons}`}</p>
      <p>{`Photos: ${photos}`}</p>
      <p>{`Top type: ${topType}`}</p>
    </section>
  )
}
