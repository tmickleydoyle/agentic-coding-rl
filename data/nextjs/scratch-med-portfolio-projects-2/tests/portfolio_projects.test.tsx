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

describe('Portfolio Projects app', () => {
  it('starts on the Projects view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('navigates to Stats view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('shows Live projects: 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Live projects: 0')).toBeInTheDocument()
  })

  it('shows No projects to show when list is empty', () => {
    render(<App />)
    expect(screen.getByText('No projects to show')).toBeInTheDocument()
  })

  it('adds a Live project and updates the live count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'My Portfolio Site', 'Web', 'Live')
    expect(screen.getByText('My Portfolio Site')).toBeInTheDocument()
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
  })

  it('adds a Draft project and does not increment live count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Stealth App', 'Mobile', 'Draft')
    expect(screen.getByText('Stealth App')).toBeInTheDocument()
    expect(screen.getByText('Live projects: 0')).toBeInTheDocument()
  })

  it('ignores a blank project title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(screen.getByText('No projects to show')).toBeInTheDocument()
    expect(screen.getByText('Live projects: 0')).toBeInTheDocument()
  })

  it('shows project category in the row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Logo Refresh', 'Design', 'Live')
    const item = screen.getByText('Logo Refresh').closest('li') as HTMLElement
    expect(within(item).getByText('Design')).toBeInTheDocument()
  })

  it('shows project status in the row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Beta App', 'Mobile', 'Draft')
    const item = screen.getByText('Beta App').closest('li') as HTMLElement
    expect(within(item).getByText('Draft')).toBeInTheDocument()
  })

  it('toggles a project status between Live and Draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Toggleable', 'Web', 'Live')
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle status toggleable/i }))
    expect(screen.getByText('Live projects: 0')).toBeInTheDocument()
    const item = screen.getByText('Toggleable').closest('li') as HTMLElement
    expect(within(item).getByText('Draft')).toBeInTheDocument()
  })

  it('deletes a project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Gone Project', 'Other', 'Live')
    expect(screen.getByText('Gone Project')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /delete gone project/i }))
    expect(screen.queryByText('Gone Project')).not.toBeInTheDocument()
    expect(screen.getByText('No projects to show')).toBeInTheDocument()
  })

  it('filter by Live hides Draft projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'LiveOne', 'Web', 'Live')
    await addProject(u, 'DraftOne', 'Mobile', 'Draft')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Live')
    expect(screen.getByText('LiveOne')).toBeInTheDocument()
    expect(screen.queryByText('DraftOne')).not.toBeInTheDocument()
  })

  it('filter by Draft hides Live projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'LiveTwo', 'Design', 'Live')
    await addProject(u, 'DraftTwo', 'Other', 'Draft')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Draft')
    expect(screen.queryByText('LiveTwo')).not.toBeInTheDocument()
    expect(screen.getByText('DraftTwo')).toBeInTheDocument()
  })

  it('live count stays accurate regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'ShowA', 'Web', 'Live')
    await addProject(u, 'ShowB', 'Web', 'Draft')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Draft')
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
  })

  it('shows No projects to show when filter matches nothing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'OnlyDraft', 'Web', 'Draft')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'Live')
    expect(screen.getByText('No projects to show')).toBeInTheDocument()
  })

  it('Stats view shows correct totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Site A', 'Web', 'Live')
    await addProject(u, 'App B', 'Mobile', 'Draft')
    await addProject(u, 'Logo C', 'Design', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('Stats view shows category breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Web Thing', 'Web', 'Live')
    await addProject(u, 'Mobile Thing', 'Mobile', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 1')).toBeInTheDocument()
    expect(screen.getByText('Mobile: 1')).toBeInTheDocument()
    expect(screen.getByText('Design: 0')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('Stats shows Live rate: 0% with no projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('Stats shows correct live rate percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'P1', 'Web', 'Live')
    await addProject(u, 'P2', 'Web', 'Live')
    await addProject(u, 'P3', 'Web', 'Draft')
    await addProject(u, 'P4', 'Web', 'Draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 50%')).toBeInTheDocument()
  })

  it('Stats updates after toggling a project status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Flip Me', 'Other', 'Live')
    await u.click(screen.getByRole('button', { name: /toggle status flip me/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 0')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('theme starts as light and toggles to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Projects')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('project list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Persistent Project', 'Design', 'Live')
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Persistent Project')).toBeInTheDocument()
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
  })
})
