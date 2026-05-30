'use client'
import type { Build } from '../lib/types'

export default function BuildRow({
  build,
  onRetry,
}: {
  build: Build
  onRetry: (id: string) => void
}) {
  // TODO: render <li data-testid="build-<id>" data-status> with number, status, and a
  // retry-<id> button that calls onRetry(build.id).
  void onRetry
  return <li data-testid={`build-${build.id}`} />
}
