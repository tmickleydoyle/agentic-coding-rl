'use client'
import { useApp } from '../../components/AppStateProvider'
import { candidatesForJob } from '../../hooks/usePipeline'
import JobRow from '../../components/JobRow'

export default function JobsPage() {
  const { jobs, candidates, selectJob } = useApp()
  return (
    <section data-testid="page-jobs">
      <h1>Jobs</h1>
      <ul data-testid="job-list">
        {jobs.map((j) => (
          <JobRow
            key={j.id}
            job={j}
            count={candidatesForJob(candidates, j.id).length}
            onOpen={selectJob}
          />
        ))}
      </ul>
    </section>
  )
}
