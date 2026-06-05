import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Portfolio Project Tracker', () => {
  it('starts on the Projects view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('seeds three initial projects', () => {
    render(<App />)
    expect(screen.getByText('Personal Website')).toBeInTheDocument()
    expect(screen.getByText('Fitness App')).toBeInTheDocument()
    expect(screen.getByText('Logo Pack')).toBeInTheDocument()
  })

  it('shows Showing: 3 of 3 on load', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
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

  it('adds a new project with Draft status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Project title'))
    await u.type(screen.getByLabelText('Project title'), 'New Portfolio Site')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(screen.getByText('New Portfolio Site')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 of 4')).toBeInTheDocument()
  })

  it('ignores blank project title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('toggles a Draft project to Live with Publish button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /publish fitness app/i }))
    const li = screen.getByText('Fitness App').closest('li') as HTMLElement
    expect(within(li).getByText('Live')).toBeInTheDocument()
  })

  it('toggles a Live project to Draft with Unpublish button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /unpublish personal website/i }))
    const li = screen.getByText('Personal Website').closest('li') as HTMLElement
    expect(within(li).getByText('Draft')).toBeInTheDocument()
  })

  it('deletes a project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete logo pack/i }))
    expect(screen.queryByText('Logo Pack')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 of 2')).toBeInTheDocument()
  })

  it('filters projects by category', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Web')
    expect(screen.getByText('Personal Website')).toBeInTheDocument()
    expect(screen.queryByText('Fitness App')).not.toBeInTheDocument()
    expect(screen.queryByText('Logo Pack')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })

  it('filter shows 0 of total when no match', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Other')
    expect(screen.getByText('Showing: 0 of 3')).toBeInTheDocument()
  })

  it('resetting filter to All restores all projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Mobile')
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'All')
    expect(screen.getByText('Showing: 3 of 3')).toBeInTheDocument()
  })

  it('Stats shows correct totals from seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 67%')).toBeInTheDocument()
  })

  it('Stats shows category breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 1')).toBeInTheDocument()
    expect(screen.getByText('Mobile: 1')).toBeInTheDocument()
    expect(screen.getByText('Design: 1')).toBeInTheDocument()
  })

  it('Stats reflects a newly added project (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Brand Guide')
    await u.selectOptions(screen.getByLabelText('Category'), 'Design')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Design: 2')).toBeInTheDocument()
  })

  it('Stats reflects a publish toggle (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /publish fitness app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('Stats shows 0% live rate when no projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete personal website/i }))
    await u.click(screen.getByRole('button', { name: /delete fitness app/i }))
    await u.click(screen.getByRole('button', { name: /delete logo pack/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('Settings toggles theme and persists across views', async () => {
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

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Design')
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })
})
