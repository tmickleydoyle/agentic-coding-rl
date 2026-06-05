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

describe('Portfolio Projects (held-out)', () => {
  it('all three seeded projects appear in All filter by default', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBe(3)
  })

  it('publish then unpublish returns to draft state', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Publish Mobile App' }))
    expect(screen.getByRole('button', { name: 'Unpublish Mobile App' })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Unpublish Mobile App' }))
    expect(screen.getByRole('button', { name: 'Publish Mobile App' })).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })

  it('switching filter to All restores all projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    expect(screen.getAllByRole('listitem').length).toBe(1)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getAllByRole('listitem').length).toBe(3)
  })

  it('a newly added project appears in Draft filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'New Case Study', 'research')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Draft')
    expect(screen.getByText('New Case Study')).toBeInTheDocument()
  })

  it('a newly added project does NOT appear in Live filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Unpublished Thing', 'misc')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    expect(screen.queryByText('Unpublished Thing')).not.toBeInTheDocument()
  })

  it('publishing a project makes it appear in Live filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Publish Landing Page' }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Live')
    expect(screen.getByText('Landing Page')).toBeInTheDocument()
    expect(screen.getByText('Agency Site')).toBeInTheDocument()
    expect(screen.queryByText('Mobile App')).not.toBeInTheDocument()
  })

  it('Stats shows 100% live rate when all projects are live', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Publish Mobile App' }))
    await u.click(screen.getByRole('button', { name: 'Publish Landing Page' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live rate: 100%')).toBeInTheDocument()
    expect(screen.getByText('Draft: 0')).toBeInTheDocument()
  })

  it('Stats total updates after adding two new projects', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProject(u, 'Project X', 'ux')
    await addProject(u, 'Project Y', 'ux')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 5')).toBeInTheDocument()
    expect(screen.getByText('ux: 2 projects')).toBeInTheDocument()
  })

  it('theme toggle persists when going to Stats and back to Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Stats')
    await nav(u, 'Settings')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('draft count in Stats stays correct after publish and unpublish cycle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Publish Mobile App' }))
    await u.click(screen.getByRole('button', { name: 'Unpublish Mobile App' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Draft: 2')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })
})
