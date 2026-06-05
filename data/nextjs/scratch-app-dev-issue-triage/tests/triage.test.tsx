import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('triage filtering', () => {
  it('lists all issues by default', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-triage'))
    expect(screen.getByTestId('triage-i1')).toBeInTheDocument()
    expect(screen.getByTestId('triage-i4')).toBeInTheDocument()
  })

  it('filters by label', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-triage'))
    await user.selectOptions(screen.getByTestId('label-filter'), 'perf')
    expect(screen.getByTestId('triage-i2')).toBeInTheDocument()
    expect(screen.queryByTestId('triage-i1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('triage-i3')).not.toBeInTheDocument()
  })

  it('filters by priority', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-triage'))
    await user.selectOptions(screen.getByTestId('priority-filter'), 'low')
    expect(screen.getByTestId('triage-i3')).toBeInTheDocument()
    expect(screen.getByTestId('triage-i4')).toBeInTheDocument()
    expect(screen.queryByTestId('triage-i1')).not.toBeInTheDocument()
  })

  it('filters by unassigned', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-triage'))
    await user.selectOptions(screen.getByTestId('assignee-filter'), 'unassigned')
    expect(screen.getByTestId('triage-i2')).toBeInTheDocument()
    expect(screen.getByTestId('triage-i4')).toBeInTheDocument()
    expect(screen.queryByTestId('triage-i1')).not.toBeInTheDocument()
  })

  it('filters by a specific assignee', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-triage'))
    await user.selectOptions(screen.getByTestId('assignee-filter'), 'alice')
    expect(screen.getByTestId('triage-i1')).toBeInTheDocument()
    expect(screen.queryByTestId('triage-i2')).not.toBeInTheDocument()
  })

  it('combines label and priority filters to an empty state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-triage'))
    await user.selectOptions(screen.getByTestId('label-filter'), 'perf')
    await user.selectOptions(screen.getByTestId('priority-filter'), 'high')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('triage-list')).not.toBeInTheDocument()
  })
})
