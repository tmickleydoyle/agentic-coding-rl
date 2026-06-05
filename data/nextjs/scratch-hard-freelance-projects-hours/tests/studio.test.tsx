import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function logTime(
  u: U,
  task: string,
  hours: string,
  project: string,
  billable: boolean,
) {
  await u.clear(screen.getByLabelText(/task/i))
  await u.type(screen.getByLabelText(/task/i), task)
  await u.clear(screen.getByLabelText(/hours/i))
  await u.type(screen.getByLabelText(/hours/i), hours)
  await u.selectOptions(screen.getByLabelText(/^project$/i), project)
  const box = screen.getByLabelText(/^billable$/i) as HTMLInputElement
  if (box.checked !== billable) await u.click(box)
  await u.click(screen.getByRole('button', { name: /log time/i }))
}
const projectsView = () => screen.getByRole('region', { name: 'Projects view' })
const reportsView = () => screen.getByRole('region', { name: 'Reports view' })

describe('Freelance time tracker', () => {
  it('starts on Time', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Time' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Projects')
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    await nav(u, 'Reports')
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument()
    await nav(u, 'Time')
    expect(screen.getByRole('heading', { name: 'Time' })).toBeInTheDocument()
  })

  it('seeds three projects in the selector', () => {
    render(<App />)
    const sel = screen.getByLabelText(/^project$/i)
    expect(within(sel).getByRole('option', { name: 'Website' })).toBeInTheDocument()
    expect(within(sel).getByRole('option', { name: 'Branding' })).toBeInTheDocument()
    expect(within(sel).getByRole('option', { name: 'App' })).toBeInTheDocument()
  })

  it('logs a billable time entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'Layout', '3', 'Website', true)
    expect(screen.getByText('Layout — 3 h — Website — BILLABLE')).toBeInTheDocument()
  })

  it('logs a non-billable time entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'Standup', '1', 'App', false)
    expect(screen.getByText('Standup — 1 h — App — NON-BILLABLE')).toBeInTheDocument()
  })

  it('ignores a non-positive hours entry', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'Nothing', '0', 'Website', true)
    expect(screen.queryByText(/nothing/i)).not.toBeInTheDocument()
  })

  it('ignores a blank task', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/hours/i), '2')
    await u.click(screen.getByRole('button', { name: /log time/i }))
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Total hours: 0 h')).toBeInTheDocument()
  })

  it('totals all hours and billable amount per project (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'Design', '2', 'Website', true)
    await logTime(u, 'Revise', '3', 'Website', true)
    await nav(u, 'Projects')
    expect(within(projectsView()).getByText('Website: 5 h, $400 billable')).toBeInTheDocument()
  })

  it('counts non-billable hours toward total hours but not billable amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'Build', '4', 'Branding', true)
    await logTime(u, 'Email', '2', 'Branding', false)
    await nav(u, 'Projects')
    expect(within(projectsView()).getByText('Branding: 6 h, $480 billable')).toBeInTheDocument()
  })

  it('shows a project with no entries as zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Projects')
    expect(within(projectsView()).getByText('App: 0 h, $0 billable')).toBeInTheDocument()
  })

  it('adds a project that appears in the Time selector', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Projects')
    await u.type(screen.getByLabelText(/project name/i), 'Consulting')
    await u.type(screen.getByLabelText(/rate/i), '200')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(within(projectsView()).getByText('Consulting: 0 h, $0 billable')).toBeInTheDocument()
    await nav(u, 'Time')
    const sel = screen.getByLabelText(/^project$/i)
    expect(within(sel).getByRole('option', { name: 'Consulting' })).toBeInTheDocument()
  })

  it('ignores a project with a non-positive rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Projects')
    await u.type(screen.getByLabelText(/project name/i), 'Bad')
    await u.type(screen.getByLabelText(/rate/i), '0')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(within(projectsView()).getAllByRole('listitem')).toHaveLength(3)
  })

  it('ignores a project with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Projects')
    await u.type(screen.getByLabelText(/rate/i), '90')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(within(projectsView()).getAllByRole('listitem')).toHaveLength(3)
  })

  it('uses the new project rate for billable amount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Projects')
    await u.type(screen.getByLabelText(/project name/i), 'Audit')
    await u.type(screen.getByLabelText(/rate/i), '100')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    await nav(u, 'Time')
    await logTime(u, 'Review', '2', 'Audit', true)
    await nav(u, 'Projects')
    expect(within(projectsView()).getByText('Audit: 2 h, $200 billable')).toBeInTheDocument()
  })

  it('reports total hours across all entries', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'A', '2', 'Website', true)
    await logTime(u, 'B', '3', 'App', false)
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Total hours: 5 h')).toBeInTheDocument()
  })

  it('reports billable hours separately from total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'A', '2', 'Website', true)
    await logTime(u, 'B', '3', 'App', false)
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Billable hours: 2 h')).toBeInTheDocument()
  })

  it('reports total billable dollars across projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'A', '2', 'Website', true)
    await logTime(u, 'B', '1', 'App', true)
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Total billable: $310')).toBeInTheDocument()
  })

  it('supports fractional hours', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'Quick', '1.5', 'Website', true)
    await nav(u, 'Projects')
    expect(within(projectsView()).getByText('Website: 1.5 h, $120 billable')).toBeInTheDocument()
  })

  it('clears the task and hours after logging', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'Clearme', '2', 'Website', true)
    expect(screen.getByLabelText(/task/i)).toHaveValue('')
    expect(screen.getByLabelText(/hours/i)).toHaveValue(null)
  })
})
