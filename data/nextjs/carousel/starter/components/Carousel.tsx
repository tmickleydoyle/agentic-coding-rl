'use client'
import { useState } from 'react'
import type { Slide } from './types'
import Dots from './Dots'

// TODO: track active index (start 0). Render <button data-testid="prev">, the active slide's
// caption in <div data-testid="slide">, <button data-testid="next">, and a Dots reflecting
// slides.length / active (clicking a dot jumps). Next wraps last->0; Prev wraps 0->last.
export default function Carousel({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <div data-testid="slide" />
    </div>
  )
}
