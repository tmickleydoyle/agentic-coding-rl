// HELD-OUT generalization tests — fresh scenarios not seen during development.
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

describe('Design Request Queue (held-out)', () => {
  it('all three seed items appear with correct initial count', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /requests \(3\)/i })).toBeInTheDocument()
  })

  it('new request starts with status new and shows in new filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Email template', 'low')
    await u.click(screen.getByRole('button', { name: 'new' }))
    expect(screen.getByText('Email template')).toBeInTheDocument()
  })

  it('promoting a request to done is reflected in stats completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Move Logo refresh (new) -> done
    await u.selectOptions(screen.getByLabelText('Status for Logo refresh'), 'done')
    // Move Homepage redesign (in-progress) -> done
    await u.selectOptions(screen.getByLabelText('Status for Homepage redesign'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })

  it('adding a high-priority request updates High Priority stat', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Critical landing page', 'high')
    await addRequest(u, 'Another high item', 'high')
    await nav(u, 'Stats')
    expect(screen.getByText('High Priority: 3')).toBeInTheDocument()
  })

  it('clear all then add a new request shows count 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /clear all requests/i }))
    await nav(u, 'Queue')
    await addRequest(u, 'Fresh start', 'medium')
    expect(screen.getByRole('heading', { name: /requests \(1\)/i })).toBeInTheDocument()
  })

  it('done filter count matches stats Done count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Logo refresh'), 'done')
    await u.click(screen.getByRole('button', { name: 'done' }))
    const queueDoneCount = 2 // Icon set + Logo refresh
    expect(screen.getByRole('heading', { name: `Requests (${queueDoneCount})` })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText(`Done: ${queueDoneCount}`)).toBeInTheDocument()
  })

  it('filter resets displayed count correctly after adding items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Extra new item', 'low')
    await u.click(screen.getByRole('button', { name: 'new' }))
    // Logo refresh + Extra new item
    expect(screen.getByRole('heading', { name: /requests \(2\)/i })).toBeInTheDocument()
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

  it('stats In Progress count updates after status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Homepage redesign'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
  })

  it('All button resets filter after a status filter was active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'in-progress' }))
    expect(screen.getByRole('heading', { name: /requests \(1\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: /requests \(3\)/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })
})
