'use client'
import type { BuildStatus } from '../lib/types'

export default function StatusBadge({ status }: { status: BuildStatus }) {
  // TODO: render <span data-testid="badge" data-status={status}>
  void status
  return <span data-testid="badge" />
}
