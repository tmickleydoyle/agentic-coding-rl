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

describe('Portfolio Projects app', () => {
  it('starts on the Projects view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByText('Landing Page')).toBeInTheDocument()
    expect(screen.getByText('iOS App')).toBeInTheDocument()
    expect(screen.getByText('Brand Kit')).toBeInTheDocument()
  })

  it('shows the correct initial project count including seeded items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Projects (3)' })).toBeInTheDocument()
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

  it('navigates back to Projects view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument()
  })

  it('adds a new project and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'New Website', 'Web', 'Live')
    expect(screen.getByText('New Website')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Projects (4)' })).toBeInTheDocument()
  })

  it('ignores a blank project title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(screen.getByRole('heading', { name: 'Projects (3)' })).toBeInTheDocument()
  })

  it('filters projects by Live status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    expect(screen.getByRole('heading', { name: 'Projects (2)' })).toBeInTheDocument()
    expect(screen.getByText('Landing Page')).toBeInTheDocument()
    expect(screen.getByText('Brand Kit')).toBeInTheDocument()
    expect(screen.queryByText('iOS App')).not.toBeInTheDocument()
  })

  it('filters projects by Draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByRole('heading', { name: 'Projects (1)' })).toBeInTheDocument()
    expect(screen.getByText('iOS App')).toBeInTheDocument()
    expect(screen.queryByText('Landing Page')).not.toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByRole('heading', { name: 'Projects (3)' })).toBeInTheDocument()
  })

  it('toggles a project status between Live and Draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = screen.getByText('Landing Page').closest('li') as HTMLElement
    expect(within(row).getByText('Live')).toBeInTheDocument()
    await u.click(within(row).getByRole('button', { name: /toggle status landing page/i }))
    expect(within(row).getByText('Draft')).toBeInTheDocument()
  })

  it('deletes a project and decreases count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete ios app/i }))
    expect(screen.queryByText('iOS App')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Projects (2)' })).toBeInTheDocument()
  })

  it('Stats shows seeded totals correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('Stats shows correct live rate for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 67%')).toBeInTheDocument()
  })

  it('Stats shows 0% live rate when no projects exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete landing page/i }))
    await u.click(screen.getByRole('button', { name: /delete ios app/i }))
    await u.click(screen.getByRole('button', { name: /delete brand kit/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('Stats category counts reflect seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 1')).toBeInTheDocument()
    expect(screen.getByText('Mobile: 1')).toBeInTheDocument()
    expect(screen.getByText('Design: 1')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('adding a project updates Stats (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Portfolio Site', 'Other', 'Draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Other: 1')).toBeInTheDocument()
  })

  it('toggling a project status updates Stats live count (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle status ios app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('toggles the theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Projects')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Persistent App', 'Mobile', 'Live')
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Persistent App')).toBeInTheDocument()
  })

  it('filter state resets do not affect stored projects in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByRole('heading', { name: 'Projects (1)' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
  })
})
