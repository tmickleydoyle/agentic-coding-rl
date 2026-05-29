'use client'
import { useState } from 'react'

type Q = { prompt: string; choices: string[]; answer: number }

export default function Quiz({ questions }: { questions: Q[] }) {
  // TODO: track current index + score; advance on click; show result + Restart at end.
  return <div></div>
}
