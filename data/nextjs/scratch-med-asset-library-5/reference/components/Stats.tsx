'use client'
import { useApp } from '../hooks/useApp'
import type { AssetType } from '../lib/types'

const TYPES: AssetType[] = ['logo', 'icon', 'photo']

export function Stats() {
  const { assets } = useApp()
  const total = assets.length
  const countOf = (t: AssetType) => assets.filter((a) => a.type === t).length

  let mostCommon = 'None'
  if (total > 0) {
    let best = -1
    TYPES.forEach((t) => {
      const c = countOf(t)
      if (c > best) {
        best = c
        mostCommon = t
      }
    })
  }

  return (
    <section aria-label="Stats view">
      <h1>Stats</h1>
      <p>{`Total assets: ${total}`}</p>
      <p>{`Logos: ${countOf('logo')}`}</p>
      <p>{`Icons: ${countOf('icon')}`}</p>
      <p>{`Photos: ${countOf('photo')}`}</p>
      <p>{`Most common type: ${mostCommon}`}</p>
    </section>
  )
}
