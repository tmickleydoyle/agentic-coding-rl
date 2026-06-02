import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Portfolio Project Tracker (held-out)', () => {
  it('new project appears with Publish button (status Draft)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Icon Set')
    await u.selectOptions(screen.getByLabelText('Category'), 'Other')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    expect(screen.getByRole('button', { name: /publish icon set/i })).toBeInTheDocument()
  })

  it('publishing a new project changes button to Unpublish', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Icon Set')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    await u.click(screen.getByRole('button', { name: /publish icon set/i }))
    expect(screen.getByRole('button', { name: /unpublish icon set/i })).toBeInTheDocument()
  })

  it('Mobile filter shows only Fitness App', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Mobile')
    expect(screen.getByText('Fitness App')).toBeInTheDocument()
    expect(screen.queryByText('Personal Website')).not.toBeInTheDocument()
    expect(screen.queryByText('Logo Pack')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 3')).toBeInTheDocument()
  })

  it('Stats does not reflect the active filter (uses all projects)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by category'), 'Web')
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 3')).toBeInTheDocument()
  })

  it('deleting a seeded project updates Stats total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete personal website/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total projects: 2')).toBeInTheDocument()
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
  })

  it('Other category line only appears in Stats when a project exists in it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.queryByText(/^Other:/)).not.toBeInTheDocument()
  })

  it('adding an Other category project makes it appear in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Project title'), 'Side Hustle')
    await u.selectOptions(screen.getByLabelText('Category'), 'Other')
    await u.click(screen.getByRole('button', { name: /add project/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Other: 1')).toBeInTheDocument()
  })

  it('Showing count after adding two projects is 5 of 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const title of ['Alpha', 'Beta']) {
      await u.clear(screen.getByLabelText('Project title'))
      await u.type(screen.getByLabelText('Project title'), title)
      await u.click(screen.getByRole('button', { name: /add project/i }))
    }
    expect(screen.getByText('Showing: 5 of 5')).toBeInTheDocument()
  })

  it('Live rate rounds correctly for 1 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /unpublish logo pack/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Live: 1')).toBeInTheDocument()
    expect(screen.getByText('Live rate: 33%')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })
})
