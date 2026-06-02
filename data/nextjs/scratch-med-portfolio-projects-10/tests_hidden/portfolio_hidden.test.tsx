// HELD-OUT generalization tests — fresh scenarios, different inputs and sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Portfolio Projects (held-out)', () => {
  it('seeded projects each show their category', () => {
    render(<App />)
    const siteRow = screen.getByText('Personal Site').closest('li') as HTMLElement
    expect(within(siteRow).getByText('Web')).toBeInTheDocument()
    const recipeRow = screen.getByText('Recipe App').closest('li') as HTMLElement
    expect(within(recipeRow).getByText('Mobile')).toBeInTheDocument()
    const logoRow = screen.getByText('Logo Pack').closest('li') as HTMLElement
    expect(within(logoRow).getByText('Design')).toBeInTheDocument()
  })

  it('adding a Live project updates Stats live count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Analytics Tool')
    await u.selectOptions(screen.getByLabelText('Status'), 'Live')
    await u.click(screen.getByRole('button', { name: 'Add Project' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
    expect(screen.getByText('Live: 3')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('adding a Draft project updates Stats draft count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Beta Tool')
    await u.selectOptions(screen.getByLabelText('Status'), 'Draft')
    await u.click(screen.getByRole('button', { name: 'Add Project' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
  })

  it('double-toggling a status returns to original', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = screen.getByText('Personal Site').closest('li') as HTMLElement
    await u.click(screen.getByRole('button', { name: 'Toggle Personal Site' }))
    expect(within(row).getByText('Draft')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Toggle Personal Site' }))
    expect(within(row).getByText('Live')).toBeInTheDocument()
  })

  it('Stats ignores filter — counts all projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('filter by Live count updates when a project is toggled to Draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    expect(screen.getByText('Showing: 2 projects')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Toggle Personal Site' }))
    expect(screen.getByText('Showing: 1 projects')).toBeInTheDocument()
  })

  it('can add an Other category project', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Misc Tool')
    await u.selectOptions(screen.getByLabelText('Category'), 'Other')
    await u.click(screen.getByRole('button', { name: 'Add Project' }))
    const row = screen.getByText('Misc Tool').closest('li') as HTMLElement
    expect(within(row).getByText('Other')).toBeInTheDocument()
  })

  it('deleting all projects shows Live rate 0%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Delete Personal Site' }))
    await u.click(screen.getByRole('button', { name: 'Delete Recipe App' }))
    await u.click(screen.getByRole('button', { name: 'Delete Logo Pack' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total projects: 0')).toBeInTheDocument()
  })

  it('toggle theme button text updates to show dark', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('projects added while filter is active still appear in full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    await u.type(screen.getByLabelText('Title'), 'Hidden Draft')
    await u.selectOptions(screen.getByLabelText('Status'), 'Draft')
    await u.click(screen.getByRole('button', { name: 'Add Project' }))
    // still filtered to Live so Hidden Draft should not appear
    expect(screen.queryByText('Hidden Draft')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByText('Hidden Draft')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4 projects')).toBeInTheDocument()
  })
})
