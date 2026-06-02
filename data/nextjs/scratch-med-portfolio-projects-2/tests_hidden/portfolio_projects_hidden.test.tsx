// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
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
  it('adding multiple projects all appear in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Alpha', 'Web', 'Live')
    await addProject(u, 'Beta', 'Mobile', 'Draft')
    await addProject(u, 'Gamma', 'Design', 'Live')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
    expect(screen.getByText('Live projects: 2')).toBeInTheDocument()
  })

  it('toggling Draft to Live increments live count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Awaken', 'Other', 'Draft')
    expect(screen.getByText('Live projects: 0')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle status awaken/i }))
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
    const item = screen.getByText('Awaken').closest('li') as HTMLElement
    expect(within(item).getByText('Live')).toBeInTheDocument()
  })

  it('deleting all projects shows No projects to show', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Solo', 'Web', 'Live')
    await u.click(screen.getByRole('button', { name: /delete solo/i }))
    expect(screen.getByText('No projects to show')).toBeInTheDocument()
    expect(screen.getByText('Live projects: 0')).toBeInTheDocument()
  })

  it('Stats live rate rounds to nearest whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'X1', 'Web', 'Live')
    await addProject(u, 'X2', 'Web', 'Draft')
    await addProject(u, 'X3', 'Web', 'Draft')
    await nav(u, 'Stats')
    // 1/3 = 33%
    expect(screen.getByText('Live rate: 33%')).toBeInTheDocument()
  })

  it('Stats Total projects: 0 initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 0')).toBeInTheDocument()
    expect(screen.getByText('Live: 0')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
  })

  it('filter All shows all projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'ShowLive', 'Web', 'Live')
    await addProject(u, 'ShowDraft', 'Web', 'Draft')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Live')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'All')
    expect(screen.getByText('ShowLive')).toBeInTheDocument()
    expect(screen.getByText('ShowDraft')).toBeInTheDocument()
  })

  it('Stats Other category count updates after add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Misc1', 'Other', 'Draft')
    await addProject(u, 'Misc2', 'Other', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Other: 2')).toBeInTheDocument()
  })

  it('deleting a live project decrements live count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'ToRemove', 'Design', 'Live')
    await addProject(u, 'Keeper', 'Design', 'Live')
    await u.click(screen.getByRole('button', { name: /delete toremove/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 1')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })

  it('toggle theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('input is cleared after adding a project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Cleared Title', 'Web', 'Live')
    expect(screen.getByLabelText(/project title/i)).toHaveValue('')
  })
})
