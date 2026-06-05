import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addProject(u: U, title: string, category: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.clear(screen.getByLabelText('Category'))
  await u.type(screen.getByLabelText('Category'), category)
  await u.click(screen.getByRole('button', { name: /add project/i }))
}

function row(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Portfolio Projects app', () => {
  it('starts on the Projects view with seed data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByText('Personal Website')).toBeInTheDocument()
    expect(screen.getByText('Budget App')).toBeInTheDocument()
    expect(screen.getByText('API Boilerplate')).toBeInTheDocument()
  })

  it('shows correct initial Showing count with all three seed projects', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('adds a new project with draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'New Tool', 'DevOps')
    expect(screen.getByText('New Tool')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 projects')).toBeInTheDocument()
    expect(within(row('New Tool')).getByText('draft')).toBeInTheDocument()
  })

  it('ignores a project with blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Category'))
    await u.type(screen.getByLabelText('Category'), 'Web')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('ignores a project with blank category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Title'))
    await u.type(screen.getByLabelText('Title'), 'Ghost Project')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('toggles a draft project to live', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(within(row('Budget App')).getByText('draft')).toBeInTheDocument()
    await u.click(within(row('Budget App')).getByRole('button', { name: /mark live budget app/i }))
    expect(within(row('Budget App')).getByText('live')).toBeInTheDocument()
  })

  it('toggles a live project to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(within(row('Personal Website')).getByText('live')).toBeInTheDocument()
    await u.click(within(row('Personal Website')).getByRole('button', { name: /mark draft personal website/i }))
    expect(within(row('Personal Website')).getByText('draft')).toBeInTheDocument()
  })

  it('deletes a project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Budget App')).getByRole('button', { name: /delete budget app/i }))
    expect(screen.queryByText('Budget App')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 projects')).toBeInTheDocument()
  })

  it('filters by live status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'live')
    expect(screen.getByText('Showing: 2 projects')).toBeInTheDocument()
    expect(screen.getByText('Personal Website')).toBeInTheDocument()
    expect(screen.getByText('API Boilerplate')).toBeInTheDocument()
    expect(screen.queryByText('Budget App')).not.toBeInTheDocument()
  })

  it('filters by draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'draft')
    expect(screen.getByText('Showing: 1 projects')).toBeInTheDocument()
    expect(screen.getByText('Budget App')).toBeInTheDocument()
    expect(screen.queryByText('Personal Website')).not.toBeInTheDocument()
  })

  it('filter all shows all projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'live')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('Stats shows correct seed totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 67%')).toBeInTheDocument()
  })

  it('Stats shows category breakdown for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 1')).toBeInTheDocument()
    expect(screen.getByText('Mobile: 1')).toBeInTheDocument()
    expect(screen.getByText('Backend: 1')).toBeInTheDocument()
  })

  it('Stats updates live rate after toggling a project status (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Budget App')).getByRole('button', { name: /mark live budget app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('Stats shows 0% live rate when no projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Personal Website')).getByRole('button', { name: /delete personal website/i }))
    await u.click(within(row('Budget App')).getByRole('button', { name: /delete budget app/i }))
    await u.click(within(row('API Boilerplate')).getByRole('button', { name: /delete api boilerplate/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('Stats reflects a newly added project in the category breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Dashboard', 'Web')
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 2')).toBeInTheDocument()
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
  })

  it('Settings toggles theme between light and dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Projects')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('project state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Keeper', 'Web')
    await nav(u, 'Settings')
    await nav(u, 'Projects')
    expect(screen.getByText('Keeper')).toBeInTheDocument()
  })
})
