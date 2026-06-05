import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addProject(u: U, title: string, category: string) {
  await u.clear(screen.getByLabelText('Project title'))
  await u.type(screen.getByLabelText('Project title'), title)
  await u.clear(screen.getByLabelText('Category'))
  await u.type(screen.getByLabelText('Category'), category)
  await u.click(screen.getByRole('button', { name: /add project/i }))
}

describe('Portfolio Projects app', () => {
  it('starts on the Projects view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('shows seeded projects on load', () => {
    render(<App />)
    expect(screen.getByText('Agency Site')).toBeInTheDocument()
    expect(screen.getByText('Mobile App')).toBeInTheDocument()
    expect(screen.getByText('Landing Page')).toBeInTheDocument()
  })

  it('shows Live: 1 on load reflecting seeded data', () => {
    render(<App />)
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
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

  it('navigates back to Projects after visiting Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('adds a new project as draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'New Portfolio', 'design')
    expect(screen.getByText('New Portfolio')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publish New Portfolio' })).toBeInTheDocument()
  })

  it('ignores a blank project title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add project/i }))
    // still only 3 seeded projects visible
    expect(screen.getAllByRole('listitem').length).toBe(3)
  })

  it('publishes a draft project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Publish Mobile App' }))
    expect(screen.queryByRole('button', { name: 'Publish Mobile App' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Unpublish Mobile App' })).toBeInTheDocument()
  })

  it('unpublishes a live project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Unpublish Agency Site' }))
    expect(screen.queryByRole('button', { name: 'Unpublish Agency Site' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publish Agency Site' })).toBeInTheDocument()
  })

  it('Live count updates after publishing a draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    // start: Live 1
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Publish Mobile App' }))
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
  })

  it('Live count updates after unpublishing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Unpublish Agency Site' }))
    expect(screen.getByText('Live: 0')).toBeInTheDocument()
  })

  it('filter shows only live projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    expect(screen.getByText('Agency Site')).toBeInTheDocument()
    expect(screen.queryByText('Mobile App')).not.toBeInTheDocument()
    expect(screen.queryByText('Landing Page')).not.toBeInTheDocument()
  })

  it('filter shows only draft projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.queryByText('Agency Site')).not.toBeInTheDocument()
    expect(screen.getByText('Mobile App')).toBeInTheDocument()
    expect(screen.getByText('Landing Page')).toBeInTheDocument()
  })

  it('Live count is unaffected by filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    // Agency Site is hidden by filter but still counted
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })

  it('Stats shows seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
  })

  it('Stats shows Live rate for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 33%')).toBeInTheDocument()
  })

  it('Stats shows 0% live rate when no projects are live', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Unpublish Agency Site' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('Stats reflects publish action (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Publish Landing Page' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 67%')).toBeInTheDocument()
  })

  it('Stats shows category breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('web: 2 projects')).toBeInTheDocument()
    expect(screen.getByText('mobile: 1 projects')).toBeInTheDocument()
  })

  it('Stats category updates after adding a new project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Blog Redesign', 'web')
    await nav(u, 'Stats')
    expect(screen.getByText('web: 3 projects')).toBeInTheDocument()
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Projects')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Persistent Project', 'branding')
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Persistent Project')).toBeInTheDocument()
  })
})
