import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addProject(
  u: U,
  title: string,
  category = 'Web',
  status = 'Live',
) {
  await u.clear(screen.getByLabelText(/project title/i))
  await u.type(screen.getByLabelText(/project title/i), title)
  await u.selectOptions(screen.getByLabelText(/^category$/i), category)
  await u.selectOptions(screen.getByLabelText(/^status$/i), status)
  await u.click(screen.getByRole('button', { name: /add project/i }))
}

describe('Portfolio Projects (held-out)', () => {
  it('heading count respects filter when showing Mobile only', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Site A', 'Web', 'Live')
    await addProject(u, 'Site B', 'Web', 'Draft')
    await addProject(u, 'App C', 'Mobile', 'Live')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Mobile')
    expect(screen.getByRole('heading', { name: /projects \(1\)/i })).toBeInTheDocument()
  })

  it('deleting a live project decrements Live count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Remove Me', 'Design', 'Live')
    await addProject(u, 'Keep Me', 'Design', 'Live')
    await u.click(screen.getByRole('button', { name: /delete Remove Me/i }))
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })

  it('Stats live rate rounds to nearest integer for a third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'X', 'Web', 'Live')
    await addProject(u, 'Y', 'Web', 'Draft')
    await addProject(u, 'Z', 'Web', 'Draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 33%')).toBeInTheDocument()
  })

  it('Stats reflects a deletion (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Temp', 'Mobile', 'Live')
    await u.click(screen.getByRole('button', { name: /delete Temp/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('filter does not affect Stats counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'W', 'Web', 'Live')
    await addProject(u, 'D', 'Design', 'Draft')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Web')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 2')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('can add multiple projects with the same category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'First', 'Mobile', 'Live')
    await addProject(u, 'Second', 'Mobile', 'Draft')
    await addProject(u, 'Third', 'Mobile', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Mobile: 3')).toBeInTheDocument()
  })

  it('Design filter shows only Design projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Logo', 'Design', 'Live')
    await addProject(u, 'App', 'Mobile', 'Live')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Design')
    expect(screen.getByText('Logo')).toBeInTheDocument()
    expect(screen.queryByText('App')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /projects \(1\)/i })).toBeInTheDocument()
  })

  it('toggle theme back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('project title input clears after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Clear Test', 'Web', 'Live')
    const input = screen.getByLabelText(/project title/i) as HTMLInputElement
    expect(input.value).toBe('')
  })
})
