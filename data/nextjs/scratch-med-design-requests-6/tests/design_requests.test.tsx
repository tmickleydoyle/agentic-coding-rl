import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addRequest(u: U, title: string, priority = 'medium') {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Priority'), priority)
  await u.click(screen.getByRole('button', { name: /add request/i }))
}

describe('Design Request Queue', () => {
  it('starts on the Queue view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
  })

  it('seeds three initial requests', () => {
    render(<App />)
    expect(screen.getByText('Homepage redesign')).toBeInTheDocument()
    expect(screen.getByText('Logo refresh')).toBeInTheDocument()
    expect(screen.getByText('Icon set')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /requests \(3\)/i })).toBeInTheDocument()
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

  it('navigates back to Queue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
  })

  it('adds a new request', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Brand guide')
    expect(screen.getByText('Brand guide')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /requests \(4\)/i })).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add request/i }))
    expect(screen.getByRole('heading', { name: /requests \(3\)/i })).toBeInTheDocument()
  })

  it('filters by new status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'new' }))
    expect(screen.getByRole('heading', { name: /requests \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Logo refresh')).toBeInTheDocument()
    expect(screen.queryByText('Homepage redesign')).not.toBeInTheDocument()
  })

  it('filters by in-progress status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'in-progress' }))
    expect(screen.getByRole('heading', { name: /requests \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Homepage redesign')).toBeInTheDocument()
  })

  it('filters by done status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'done' }))
    expect(screen.getByRole('heading', { name: /requests \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Icon set')).toBeInTheDocument()
  })

  it('All filter shows all requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'new' }))
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: /requests \(3\)/i })).toBeInTheDocument()
  })

  it('active filter button has aria-pressed true', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'done' }))
    expect(screen.getByRole('button', { name: 'done' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('changes a request status in place', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Logo refresh'), 'in-progress')
    await u.click(screen.getByRole('button', { name: 'in-progress' }))
    expect(screen.getByText('Logo refresh')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /requests \(2\)/i })).toBeInTheDocument()
  })

  it('stats show seeded data correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('High Priority: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('stats update after changing a status (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Logo refresh'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('stats show 0% when no requests exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all requests/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('stats counts high priority requests added via queue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Urgent banner', 'high')
    await nav(u, 'Stats')
    expect(screen.getByText('High Priority: 2')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Queue')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('clear all requests empties the queue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all requests/i }))
    await nav(u, 'Queue')
    expect(screen.getByRole('heading', { name: /requests \(0\)/i })).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'done' }))
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    expect(screen.getByRole('button', { name: 'done' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('heading', { name: /requests \(1\)/i })).toBeInTheDocument()
  })

  it('stats ignore filter and count all requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'new' }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })
})
