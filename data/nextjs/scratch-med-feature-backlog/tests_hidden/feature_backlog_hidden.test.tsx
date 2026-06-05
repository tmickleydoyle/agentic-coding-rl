import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Feature Backlog (held-out)', () => {
  it('shows Features (3) on initial load with all three seeded items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /features \(3\)/i })).toBeInTheDocument()
  })

  it('filter by P2 shows only CSV export', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P2')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('CSV export')).toBeInTheDocument()
    expect(screen.queryByText('User authentication')).not.toBeInTheDocument()
    expect(screen.queryByText('Dark mode')).not.toBeInTheDocument()
  })

  it('filter by status building shows only User authentication', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'building')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('User authentication')).toBeInTheDocument()
  })

  it('filter by status idea shows only Dark mode', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'idea')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('adding two features updates count to 5', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (const title of ['Search bar', 'Export PDF']) {
      await u.clear(screen.getByLabelText(/feature title/i))
      await u.type(screen.getByLabelText(/feature title/i), title)
      await u.click(screen.getByRole('button', { name: /add feature/i }))
    }
    expect(screen.getByRole('heading', { name: /features \(5\)/i })).toBeInTheDocument()
  })

  it('new feature appears in Stats as P1 and idea', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/feature title/i), 'Webhooks')
    await u.click(screen.getByRole('button', { name: /add feature/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('P1: 2')).toBeInTheDocument()
    expect(screen.getByText('Idea: 2')).toBeInTheDocument()
  })

  it('Stats shipped rate is 100% when all features are shipped', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for User authentication'), 'shipped')
    await u.selectOptions(screen.getByLabelText('Status for Dark mode'), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 3')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 100%')).toBeInTheDocument()
  })

  it('Stats shipped rate rounds correctly for 2 of 3', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Dark mode'), 'shipped')
    await nav(u, 'Stats')
    expect(screen.getByText('Shipped: 2')).toBeInTheDocument()
    expect(screen.getByText('Shipped rate: 67%')).toBeInTheDocument()
  })

  it('priority change is reflected in Stats P counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Priority for Dark mode'), 'P0')
    await nav(u, 'Stats')
    expect(screen.getByText('P0: 2')).toBeInTheDocument()
    expect(screen.getByText('P1: 0')).toBeInTheDocument()
  })

  it('filter does not affect Stats counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'P0')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('deleting all P0 features changes Stats P0 to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete user authentication/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('P0: 0')).toBeInTheDocument()
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
  })

  it('theme toggles back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('status filter persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'shipped')
    await nav(u, 'Settings')
    await nav(u, 'Backlog')
    expect((screen.getByLabelText(/filter by status/i) as HTMLSelectElement).value).toBe('shipped')
    expect(screen.getByRole('heading', { name: /features \(1\)/i })).toBeInTheDocument()
  })
})
