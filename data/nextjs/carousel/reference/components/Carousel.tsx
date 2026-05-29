'use client'
import { useState } from 'react'
import type { Slide } from './types'
import Dots from './Dots'

export default function Carousel({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0)
  const n = slides.length

  const next = () => setActive((i) => (i + 1) % n)
  const prev = () => setActive((i) => (i - 1 + n) % n)

  return (
    <div>
      <button data-testid="prev" onClick={prev}>
        Prev
      </button>
      <div data-testid="slide">{slides[active].caption}</div>
      <button data-testid="next" onClick={next}>
        Next
      </button>
      <Dots count={n} active={active} onJump={setActive} />
    </div>
  )
}
