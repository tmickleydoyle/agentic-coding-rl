// HELD-OUT generalization tests — fresh scenarios not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addProject(u: U, title: string, category = 'Web', status = 'Live') {
  await u.clear(screen.getByLabelText('Project title'))
  await u.type(screen.getByLabelText('Project title'), title)
  await u.selectOptions(screen.getByLabelText('Category'), category)
  await u.selectOptions(screen.getByLabelText('Status'), status)
  await u.click(screen.getByRole('button', { name: /add project/i }))
}

describe('Portfolio Projects (held-out)', () => {
  it('deleting all seeded projects leaves an empty list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete landing page/i }))
    await u.click(screen.getByRole('button', { name: /delete ios app/i }))
    await u.click(screen.getByRole('button', { name: /delete brand kit/i }))
    expect(screen.getByRole('heading', { name: 'Projects (0)' })).toBeInTheDocument()
  })

  it('adding multiple projects with Other category updates Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Brochure', 'Other', 'Draft')
    await addProject(u, 'Flyer', 'Other', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Other: 2')).toBeInTheDocument()
    expect(screen.getByText('Total projects: 5')).toBeInTheDocument()
  })

  it('toggling a Live project to Draft then back updates Stats accurately', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = screen.getByText('Brand Kit').closest('li') as HTMLElement
    await u.click(within(row).getByRole('button', { name: /toggle status brand kit/i }))
    await u.click(within(row).getByRole('button', { name: /toggle status brand kit/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('live rate is 100% when all projects are Live', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle status ios app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('live rate is 0% when all projects are Draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle status landing page/i }))
    await u.click(screen.getByRole('button', { name: /toggle status brand kit/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Draft: 3')).toBeInTheDocument()
  })

  it('filter by Live then add a Draft project keeps filtered count unchanged', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    await addProject(u, 'Hidden Draft', 'Design', 'Draft')
    expect(screen.getByRole('heading', { name: 'Projects (2)' })).toBeInTheDocument()
    expect(screen.queryByText('Hidden Draft')).not.toBeInTheDocument()
  })

  it('filter by Draft shows newly added Draft project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Draft Thing', 'Web', 'Draft')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByText('Draft Thing')).toBeInTheDocument()
    expect(screen.getByText('iOS App')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Projects (2)' })).toBeInTheDocument()
  })

  it('Stats Mobile count increases after adding a Mobile project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Android App', 'Mobile', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Mobile: 2')).toBeInTheDocument()
  })

  it('deleting a project updates Stats total and category count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete brand kit/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 2')).toBeInTheDocument()
    expect(screen.getByText('Design: 0')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })

  it('theme toggle shows current theme in button label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('projects list state is preserved after visiting Stats and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Remembered Project', 'Design', 'Live')
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Remembered Project')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Projects (4)' })).toBeInTheDocument()
  })
})
