'use client'
import { useApp } from '../../components/AppStateProvider'
import IssueRow from '../../components/IssueRow'

export default function IssuesPage() {
  const { issues, selectIssue } = useApp()
  return (
    <section data-testid="page-issues">
      <h1>Issues</h1>
      <ul data-testid="issue-list">
        {issues.map((i) => (
          <IssueRow key={i.id} issue={i} onOpen={selectIssue} />
        ))}
      </ul>
    </section>
  )
}
