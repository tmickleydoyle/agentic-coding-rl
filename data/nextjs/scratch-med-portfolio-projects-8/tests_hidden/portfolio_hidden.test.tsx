// HELD-OUT generalization tests — fresh scenarios and edge cases not present in the visible suite.
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

describe('Portfolio Project Tracker (held-out)', () => {
  it('all four categories count correctly after adding several projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'App redesign', 'Mobile', 'Live')
    await addProject(u, 'Logo set', 'Design', 'Draft')
    await addProject(u, 'Internal tool', 'Other', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Web: 1')).toBeInTheDocument()
    expect(screen.getByText('Mobile: 2')).toBeInTheDocument()
    expect(screen.getByText('Design: 2')).toBeInTheDocument()
    expect(screen.getByText('Other: 1')).toBeInTheDocument()
  })

  it('live count is unaffected by the Draft filter being active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Extra live', 'Web', 'Live')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    // 3 seeded (2 live) + 1 new live = 3 live total
    expect(screen.getByText('Live projects: 3')).toBeInTheDocument()
  })

  it('toggling status twice returns to original and stats reflect it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /toggle status Brand identity/i }))
    await u.click(screen.getByRole('button', { name: /toggle status Brand identity/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 2')).toBeInTheDocument()
    expect(screen.getByText('Draft: 1')).toBeInTheDocument()
  })

  it('deleting a draft project reduces draft count in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete iOS app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
    expect(screen.getByText('Total projects: 2')).toBeInTheDocument()
  })

  it('live rate is 50% when half are live', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Start: 3 projects, 2 live. Toggle one live to draft => 1 live of 3 = 33%.
    // Add 1 draft => 1 live of 4 = 25%. Instead: toggle Brand identity to Draft => 1 live of 3.
    // Then delete iOS app => 1 live of 2 = 50%.
    await u.click(screen.getByRole('button', { name: /toggle status Brand identity/i }))
    await u.click(screen.getByRole('button', { name: /delete iOS app/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 50%')).toBeInTheDocument()
  })

  it('adding an Other category project shows in stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Misc task', 'Other', 'Draft')
    await nav(u, 'Stats')
    expect(screen.getByText('Other: 1')).toBeInTheDocument()
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
  })

  it('reset then add a single live project shows Live rate: 100%', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset projects/i }))
    await nav(u, 'Projects')
    await addProject(u, 'Solo project', 'Web', 'Live')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
  })

  it('filter All shows all projects after filtering by Live', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    expect(screen.queryByText('iOS app')).not.toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByText('iOS app')).toBeInTheDocument()
    expect(screen.getByText('Portfolio site')).toBeInTheDocument()
    expect(screen.getByText('Brand identity')).toBeInTheDocument()
  })

  it('theme can be toggled back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('live count after reset is zero on Projects view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset projects/i }))
    await nav(u, 'Projects')
    expect(screen.getByText('Live projects: 0')).toBeInTheDocument()
  })
})
