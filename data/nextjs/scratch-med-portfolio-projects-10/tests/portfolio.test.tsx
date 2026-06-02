import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Portfolio Projects app', () => {
  it('starts on the Projects view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('shows seeded projects on load', () => {
    render(<App />)
    expect(screen.getByText('Personal Site')).toBeInTheDocument()
    expect(screen.getByText('Recipe App')).toBeInTheDocument()
    expect(screen.getByText('Logo Pack')).toBeInTheDocument()
  })

  it('shows correct initial Showing count', () => {
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

  it('navigates back to Projects after visiting Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByRole('heading', { name: 'Projects' })).toBeInTheDocument()
  })

  it('shows seeded Stats on initial load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 67%')).toBeInTheDocument()
  })

  it('adds a new project and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Title'))
    await u.type(screen.getByLabelText('Title'), 'New Dashboard')
    await u.click(screen.getByRole('button', { name: 'Add Project' }))
    expect(screen.getByText('New Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 projects')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add Project' }))
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('deletes a project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Recipe App' }))
    expect(screen.queryByText('Recipe App')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2 projects')).toBeInTheDocument()
  })

  it('toggles a project status Live to Draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = screen.getByText('Personal Site').closest('li') as HTMLElement
    expect(within(row).getByText('Live')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Toggle Personal Site' }))
    expect(within(row).getByText('Draft')).toBeInTheDocument()
  })

  it('toggles a project status Draft to Live', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = screen.getByText('Recipe App').closest('li') as HTMLElement
    expect(within(row).getByText('Draft')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Toggle Recipe App' }))
    expect(within(row).getByText('Live')).toBeInTheDocument()
  })

  it('filter by Live shows only Live projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    expect(screen.getByText('Showing: 2 projects')).toBeInTheDocument()
    expect(screen.getByText('Personal Site')).toBeInTheDocument()
    expect(screen.getByText('Logo Pack')).toBeInTheDocument()
    expect(screen.queryByText('Recipe App')).not.toBeInTheDocument()
  })

  it('filter by Draft shows only Draft projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByText('Showing: 1 projects')).toBeInTheDocument()
    expect(screen.getByText('Recipe App')).toBeInTheDocument()
    expect(screen.queryByText('Personal Site')).not.toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('Stats reflects a toggle (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Toggle Recipe App from Draft to Live
    await u.click(screen.getByRole('button', { name: 'Toggle Recipe App' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('Stats reflects a deletion (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Logo Pack' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 2')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 50%')).toBeInTheDocument()
  })

  it('Stats shows 0% when no projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Personal Site' }))
    await u.click(screen.getByRole('button', { name: 'Delete Recipe App' }))
    await u.click(screen.getByRole('button', { name: 'Delete Logo Pack' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
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

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Showing: 1 projects')).toBeInTheDocument()
  })

  it('adds a Draft project and it appears when filtered to Draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Icon Set')
    await u.selectOptions(screen.getByLabelText('Category'), 'Design')
    await u.selectOptions(screen.getByLabelText('Status'), 'Draft')
    await u.click(screen.getByRole('button', { name: 'Add Project' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByText('Icon Set')).toBeInTheDocument()
    expect(screen.getByText('Showing: 2 projects')).toBeInTheDocument()
  })
})
