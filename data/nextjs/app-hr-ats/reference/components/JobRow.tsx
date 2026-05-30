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
  return (
    <li data-testid={`job-${job.id}`}>
      <span data-testid={`job-${job.id}-title`}>{job.title}</span>
      <span data-testid={`job-${job.id}-dept`}>{job.department}</span>
      <span data-testid={`job-${job.id}-count`}>{count}</span>
      <button data-testid={`open-${job.id}`} onClick={() => onOpen(job.id)}>
        Open
      </button>
    </li>
  )
}
