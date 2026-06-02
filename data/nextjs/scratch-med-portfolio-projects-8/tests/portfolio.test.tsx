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

describe('Portfolio Project Tracker', () => {
  it('starts on the Projects view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('seeds three initial projects', () => {
    render(<App />)
    expect(screen.getByText('Portfolio site')).toBeInTheDocument()
    expect(screen.getByText('iOS app')).toBeInTheDocument()
    expect(screen.getByText('Brand identity')).toBeInTheDocument()
  })

  it('shows the correct initial live count', () => {
    render(<App />)
    expect(screen.getByText('Live projects: 2')).toBeInTheDocument()
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

  it('adds a new project and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Dashboard UI', 'Design', 'Draft')
    expect(screen.getByText('Dashboard UI')).toBeInTheDocument()
  })

  it('ignores a blank project title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add project/i }))
    // Still only 3 items
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBe(3)
  })

  it('live count updates after adding a live project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'New site', 'Web', 'Live')
    expect(screen.getByText('Live projects: 3')).toBeInTheDocument()
  })

  it('deletes a project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete iOS app/i }))
    expect(screen.queryByText('iOS app')).not.toBeInTheDocument()
  })

  it('live count updates after deleting a live project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete Portfolio site/i }))
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
  })

  it('toggles a project status from Live to Draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Portfolio site starts Live
    await u.click(screen.getByRole('button', { name: /toggle status Portfolio site/i }))
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
  })

  it('toggles a project status from Draft to Live', async () => {
    const u = userEvent.setup()
    render(<App />)
    // iOS app starts Draft
    await u.click(screen.getByRole('button', { name: /toggle status iOS app/i }))
    expect(screen.getByText('Live projects: 3')).toBeInTheDocument()
  })

  it('filter by Live hides Draft projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    expect(screen.getByText('Portfolio site')).toBeInTheDocument()
    expect(screen.queryByText('iOS app')).not.toBeInTheDocument()
  })

  it('filter by Draft hides Live projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByText('iOS app')).toBeInTheDocument()
    expect(screen.queryByText('Portfolio site')).not.toBeInTheDocument()
  })

  it('live count stays correct regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByText('Live projects: 2')).toBeInTheDocument()
  })

  it('Stats view shows correct totals for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('Stats view shows correct live rate for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 67%')).toBeInTheDocument()
  })

  it('Stats view shows category counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 1')).toBeInTheDocument()
    expect(screen.getByText('Mobile: 1')).toBeInTheDocument()
    expect(screen.getByText('Design: 1')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('Stats updates cross-view after toggling a status (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle status iOS app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('Stats shows 0% live rate when no projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset projects/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('Reset projects clears the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset projects/i }))
    await nav(u, 'Projects')
    expect(screen.queryByText('Portfolio site')).not.toBeInTheDocument()
    expect(screen.getByText('Live projects: 0')).toBeInTheDocument()
  })

  it('theme toggle changes data-theme attribute', async () => {
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

  it('project list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Persist me', 'Other', 'Live')
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Persist me')).toBeInTheDocument()
  })
})
