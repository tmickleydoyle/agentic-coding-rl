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

  it('shows three seed projects on load', () => {
    render(<App />)
    expect(screen.getByText('Brand Redesign')).toBeInTheDocument()
    expect(screen.getByText('API Integration')).toBeInTheDocument()
    expect(screen.getByText('Landing Page')).toBeInTheDocument()
  })

  it('shows Showing: 3 projects on load', () => {
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

  it('adds a new project as draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'New Website')
    await u.type(screen.getByLabelText('Category'), 'Development')
    await u.click(screen.getByRole('button', { name: 'Add project' }))
    expect(screen.getByText('New Website')).toBeInTheDocument()
    // status should be draft
    const li = screen.getByText('New Website').closest('li') as HTMLElement
    expect(within(li).getByText('draft')).toBeInTheDocument()
  })

  it('ignores add project when title is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Category'), 'Design')
    await u.click(screen.getByRole('button', { name: 'Add project' }))
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('ignores add project when category is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Orphan')
    await u.click(screen.getByRole('button', { name: 'Add project' }))
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('toggles a project status live to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('Brand Redesign').closest('li') as HTMLElement
    expect(within(li).getByText('live')).toBeInTheDocument()
    await u.click(within(li).getByRole('button', { name: 'Toggle status' }))
    expect(within(li).getByText('draft')).toBeInTheDocument()
  })

  it('toggles a project status draft to live', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('API Integration').closest('li') as HTMLElement
    expect(within(li).getByText('draft')).toBeInTheDocument()
    await u.click(within(li).getByRole('button', { name: 'Toggle status' }))
    expect(within(li).getByText('live')).toBeInTheDocument()
  })

  it('Live only filter shows only live projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Live only' }))
    expect(screen.getByText('Showing: 2 projects')).toBeInTheDocument()
    expect(screen.getByText('Brand Redesign')).toBeInTheDocument()
    expect(screen.getByText('Landing Page')).toBeInTheDocument()
    expect(screen.queryByText('API Integration')).not.toBeInTheDocument()
  })

  it('All filter restores all projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Live only' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
    expect(screen.getByText('API Integration')).toBeInTheDocument()
  })

  it('toggling a draft project to live updates Live only count', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('API Integration').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Toggle status' }))
    await u.click(screen.getByRole('button', { name: 'Live only' }))
    expect(screen.getByText('Showing: 3 projects')).toBeInTheDocument()
  })

  it('Stats shows correct seed totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('Stats shows correct live rate for seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 67%')).toBeInTheDocument()
  })

  it('Stats shows Design and Development counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Design: 2')).toBeInTheDocument()
    expect(screen.getByText('Development: 1')).toBeInTheDocument()
  })

  it('Stats updates after adding a new project (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Mobile App')
    await u.type(screen.getByLabelText('Category'), 'Development')
    await u.click(screen.getByRole('button', { name: 'Add project' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Development: 2')).toBeInTheDocument()
  })

  it('Stats live rate is 0% when all projects are draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    // toggle both live projects to draft
    const li1 = screen.getByText('Brand Redesign').closest('li') as HTMLElement
    await u.click(within(li1).getByRole('button', { name: 'Toggle status' }))
    const li2 = screen.getByText('Landing Page').closest('li') as HTMLElement
    await u.click(within(li2).getByRole('button', { name: 'Toggle status' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('Stats reflects toggle status change cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    const li = screen.getByText('API Integration').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: 'Toggle status' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('theme starts as light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggle theme switches to dark', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Projects')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('project list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Persistent')
    await u.type(screen.getByLabelText('Category'), 'Design')
    await u.click(screen.getByRole('button', { name: 'Add project' }))
    await nav(u, 'Stats')
    await nav(u, 'Projects')
    expect(screen.getByText('Persistent')).toBeInTheDocument()
  })
})
