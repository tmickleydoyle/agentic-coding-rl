'use client'
import { useApp } from '../../components/AppStateProvider'
import { candidatesForJob } from '../../hooks/usePipeline'

export default function JobDetailPage() {
  const { jobs, candidates, selectedJobId } = useApp()
  const job = jobs.find((j) => j.id === selectedJobId)

  if (!job) {
    return (
      <section data-testid="page-job-detail">
        <p data-testid="no-job">No job selected.</p>
      </section>
    )
  }

  const jobCandidates = candidatesForJob(candidates, job.id)

  return (
    <section data-testid="page-job-detail">
      <h1 data-testid="detail-title">{job.title}</h1>
      <span data-testid="detail-dept">{job.department}</span>
      <span data-testid="detail-count">{jobCandidates.length}</span>
      <ul data-testid="detail-candidates">
        {jobCandidates.map((c) => (
          <li key={c.id} data-testid={`detail-candidate-${c.id}`} data-stage={c.stage}>
            <span data-testid={`detail-candidate-${c.id}-name`}>{c.name}</span>
            <span data-testid={`detail-candidate-${c.id}-stage`}>{c.stage}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
