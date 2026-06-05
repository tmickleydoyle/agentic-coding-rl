// HELD-OUT generalization tests — fresh scenarios covering edge cases and cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: string) {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Severity'), severity)
  await u.click(screen.getByRole('button', { name: /add bug/i }))
}

describe('Bug Triage (held-out)', () => {
  it('adding a high severity bug increments High (open) in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Server outage', 'high')
    await nav(u, 'Stats')
    expect(screen.getByText('High (open): 2')).toBeInTheDocument()
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
  })

  it('filter by closed when none closed shows Bugs (0)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'closed')
    expect(screen.getByRole('heading', { name: 'Bugs (0)' })).toBeInTheDocument()
  })

  it('closing both seed bugs updates Stats correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /close login page crash/i }))
    await u.click(screen.getByRole('button', { name: /close typo in footer/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 2')).toBeInTheDocument()
    expect(screen.getByText('High (open): 0')).toBeInTheDocument()
    expect(screen.getByText('Low (open): 0')).toBeInTheDocument()
  })

  it('bugs added with medium severity appear correctly in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Alignment issue', 'medium')
    await addBug(u, 'Color contrast', 'medium')
    await nav(u, 'Stats')
    expect(screen.getByText('Medium (open): 2')).toBeInTheDocument()
    expect(screen.getByText('Total bugs: 4')).toBeInTheDocument()
  })

  it('closing a medium bug reduces Medium (open) in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Input lag', 'medium')
    await u.click(screen.getByRole('button', { name: /close input lag/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Medium (open): 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
  })

  it('state persists across navigations: bugs added on Bugs view visible after returning', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Crash on export', 'high')
    await nav(u, 'Stats')
    await nav(u, 'Settings')
    await nav(u, 'Bugs')
    expect(screen.getByText('Crash on export')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bugs (3)' })).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('filter by open then add new bug increases visible count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.getByRole('heading', { name: 'Bugs (2)' })).toBeInTheDocument()
    await addBug(u, 'New open bug', 'low')
    expect(screen.getByRole('heading', { name: 'Bugs (3)' })).toBeInTheDocument()
  })

  it('closed bug does not appear with open filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Temp issue', 'low')
    await u.click(screen.getByRole('button', { name: /close temp issue/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'open')
    expect(screen.queryByText('Temp issue')).not.toBeInTheDocument()
    // original seeds still visible
    expect(screen.getByText('Login page crash')).toBeInTheDocument()
  })

  it('Stats Open count does not change when the Bugs filter is set to closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'closed')
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 2')).toBeInTheDocument()
  })
})
