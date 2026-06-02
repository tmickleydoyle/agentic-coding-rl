// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function logTime(u: U, task: string, hours: string, project: string, billable: boolean) {
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

describe('Freelance time tracker (held-out)', () => {
  it('keeps each project total independent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'W1', '4', 'Website', true)
    await logTime(u, 'A1', '2', 'App', true)
    await nav(u, 'Projects')
    expect(within(projectsView()).getByText('Website: 4 h, $320 billable')).toBeInTheDocument()
    expect(within(projectsView()).getByText('App: 2 h, $300 billable')).toBeInTheDocument()
  })

  it('total billable equals sum of per-project billable', async () => {
    const u = userEvent.setup()
    render(<App />)
    await logTime(u, 'W1', '2', 'Website', true)
    await logTime(u, 'B1', '1', 'Branding', false)
    await logTime(u, 'A1', '2', 'App', true)
    await nav(u, 'Reports')
    expect(within(reportsView()).getByText('Total billable: $460')).toBeInTheDocument()
    expect(within(reportsView()).getByText('Total hours: 5 h')).toBeInTheDocument()
    expect(within(reportsView()).getByText('Billable hours: 4 h')).toBeInTheDocument()
  })

  it('a new project tracks both hours and billable correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Projects')
    await u.type(screen.getByLabelText(/project name/i), 'Retainer')
    await u.type(screen.getByLabelText(/rate/i), '90')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    await nav(u, 'Time')
    await logTime(u, 'Work', '3', 'Retainer', true)
    await logTime(u, 'Chat', '1', 'Retainer', false)
    await nav(u, 'Projects')
    expect(within(projectsView()).getByText('Retainer: 4 h, $270 billable')).toBeInTheDocument()
  })
})
