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

describe('Portfolio Projects Tracker (held-out)', () => {
  it('live count reflects toggling live project to draft', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /unpublish brand identity/i }))
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
  })

  it('filter by Mobile shows only Food Delivery App initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Mobile')
    expect(screen.getByText('Food Delivery App')).toBeInTheDocument()
    expect(screen.queryByText('Agency Website')).not.toBeInTheDocument()
    expect(screen.queryByText('Brand Identity')).not.toBeInTheDocument()
  })

  it('adding an Other project shows in Other category in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Print Catalog', 'Other')
    await nav(u, 'Stats')
    expect(screen.getByText('Other: 1')).toBeInTheDocument()
    expect(screen.getByText('Total projects: 4')).toBeInTheDocument()
  })

  it('live rate is 0% after reset', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset projects/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
    expect(screen.getByText('Live: 0')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
  })

  it('after reset can add new projects and stats update', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset projects/i }))
    await nav(u, 'Projects')
    await addProject(u, 'Fresh Start', 'Web')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 1')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 0%')).toBeInTheDocument()
  })

  it('publishing all three seeded projects gives 100% live rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /publish food delivery app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 3')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('design filter works and live count remains global', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by category/i), 'Design')
    expect(screen.getByText('Brand Identity')).toBeInTheDocument()
    expect(screen.queryByText('Agency Website')).not.toBeInTheDocument()
    // Live count still global: Agency Website (live) + Brand Identity (live) = 2
    expect(screen.getByText('Live projects: 2')).toBeInTheDocument()
  })

  it('theme toggle shows dark then back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('stats category counts update correctly after adding multiple projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Mobile App 2', 'Mobile')
    await addProject(u, 'Mobile App 3', 'Mobile')
    await nav(u, 'Stats')
    expect(screen.getByText('Mobile: 3')).toBeInTheDocument()
  })

  it('toggling status back and forth keeps live count correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Unpublish Agency Website -> live=1
    await u.click(screen.getByRole('button', { name: /unpublish agency website/i }))
    expect(screen.getByText('Live projects: 1')).toBeInTheDocument()
    // Re-publish Agency Website -> live=2
    await u.click(screen.getByRole('button', { name: /publish agency website/i }))
    expect(screen.getByText('Live projects: 2')).toBeInTheDocument()
  })
})
