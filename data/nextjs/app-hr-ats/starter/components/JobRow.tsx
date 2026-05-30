'use client'
import type { Job } from '../lib/types'

export default function JobRow({
  job,
  count,
  onOpen,
}: {
  job: Job
  count: number
  onOpen: (id: string) => void
}) {
  // TODO: render <li data-testid="job-<id>"> with title, dept, count, and an open-<id>
  // button.
  void count
  void onOpen
  return <li data-testid={`job-${job.id}`} />
}
