import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addProject(u: U, title: string, category?: string) {
  await u.clear(screen.getByLabelText(/project title/i))
  await u.type(screen.getByLabelText(/project title/i), title)
  if (category) {
    await u.selectOptions(screen.getByLabelText(/^category$/i), category)
  }
  await u.click(screen.getByRole('button', { name: /add project/i }))
}

describe('Portfolio Projects Tracker', () => {
  it('starts on the Projects view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('shows seeded projects on load', () => {
    render(<App />)
    expect(screen.getByText('Agency Website')).toBeInTheDocument()
    expect(screen.getByText('Food Delivery App')).toBeInTheDocument()
    expect(screen.getByText('Brand Identity')).toBeInTheDocument()
  })

  it('shows correct initial live count', () => {
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

  it('adds a new project with draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'New Portfolio Site', 'Web')
    expect(screen.getByText('New Portfolio Site')).toBeInTheDocument()
    const li = screen.getByText('New Portfolio Site').closest('li') as HTMLElement
    expect(within(li).getByRole('button', { name: /publish new portfolio site/i })).toBeInTheDocument()
  })

  it('ignores a blank project title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add project/i }))
    // Still only 3 seeded projects
    expect(screen.getByText('Live projects: 2')).toBeInTheDocument()
  })

  it('publishes a draft project and updates live count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /publish food delivery app/i }))
    expect(screen.getByText('Live projects: 3')).toBeInTheDocument()
  })

  it('unpublishes a live project and updates live count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /unpublish agency website/i }))
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
  })

  it('toggles a project status button label after click', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /publish food delivery app/i }))
    expect(screen.getByRole('button', { name: /unpublish food delivery app/i })).toBeInTheDocument()
  })

  it('filters projects by category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Web')
    expect(screen.getByText('Agency Website')).toBeInTheDocument()
    expect(screen.queryByText('Food Delivery App')).not.toBeInTheDocument()
    expect(screen.queryByText('Brand Identity')).not.toBeInTheDocument()
  })

  it('live count is unaffected by category filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Mobile')
    expect(screen.getByText('Live projects: 2')).toBeInTheDocument()
  })

  it('filter All shows all projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Design')
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'All')
    expect(screen.getByText('Agency Website')).toBeInTheDocument()
    expect(screen.getByText('Food Delivery App')).toBeInTheDocument()
    expect(screen.getByText('Brand Identity')).toBeInTheDocument()
  })

  it('stats view shows correct totals from seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('stats shows correct live rate for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 67%')).toBeInTheDocument()
  })

  it('stats shows category counts for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 1')).toBeInTheDocument()
    expect(screen.getByText('Mobile: 1')).toBeInTheDocument()
    expect(screen.getByText('Design: 1')).toBeInTheDocument()
    expect(screen.getByText('Other: 0')).toBeInTheDocument()
  })

  it('stats updates when a project is published (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /publish food delivery app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('stats updates when a new project is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Icon Set', 'Design')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
    expect(screen.getByText('Design: 2')).toBeInTheDocument()
  })

  it('resets projects from settings and updates stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset projects/i }))
    await nav(u, 'Projects')
    expect(screen.getByText('Live projects: 0')).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Persisted Project', 'Other')
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Persisted Project')).toBeInTheDocument()
  })
})
