'use client'
import type { Order } from '../lib/types'

export default function Timeline(_props: { order: Order }) {
  // TODO: render <ol data-testid="timeline"> with one step-<status> li per timeline step,
  // each with data-reached reflecting whether the order reached that step.
  return <ol data-testid="timeline" />
}
