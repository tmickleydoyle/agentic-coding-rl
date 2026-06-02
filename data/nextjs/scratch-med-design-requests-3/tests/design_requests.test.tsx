import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Design Request Queue app', () => {
  it('starts on the Queue view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
  })

  it('shows the three seed requests on load', () => {
    render(<App />)
    expect(screen.getByText('Logo redesign')).toBeInTheDocument()
    expect(screen.getByText('Banner artwork')).toBeInTheDocument()
    expect(screen.getByText('Icon set')).toBeInTheDocument()
  })

  it('shows correct initial status counts in Queue', () => {
    render(<App />)
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
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

  it('navigates back to Queue view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
  })

  it('adds a new request with the given priority', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Splash screen')
    await u.selectOptions(screen.getByLabelText('Priority'), 'high')
    await u.click(screen.getByRole('button', { name: /add request/i }))
    expect(screen.getByText('Splash screen')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add request/i }))
    expect(screen.getByText('New: 1')).toBeInTheDocument()
  })

  it('clears the title input after adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Temp card')
    await u.click(screen.getByRole('button', { name: /add request/i }))
    expect(screen.getByLabelText('Title')).toHaveValue('')
  })

  it('updates a request status via its dropdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Logo redesign'), 'in-progress')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 2')).toBeInTheDocument()
  })

  it('filter by status shows only matching requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.getByText('Icon set')).toBeInTheDocument()
    expect(screen.queryByText('Logo redesign')).not.toBeInTheDocument()
    expect(screen.queryByText('Banner artwork')).not.toBeInTheDocument()
  })

  it('filter counts are unaffected by the active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('filter all shows every request', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Logo redesign')).toBeInTheDocument()
    expect(screen.getByText('Banner artwork')).toBeInTheDocument()
    expect(screen.getByText('Icon set')).toBeInTheDocument()
  })

  it('Stats view shows correct initial totals', async () => {
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

  it('Stats completion is 0% when no requests are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Icon set'), 'new')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Stats updates when a request status is changed (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Logo redesign'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('adding a high-priority request updates High Priority in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Brand guide')
    await u.selectOptions(screen.getByLabelText('Priority'), 'high')
    await u.click(screen.getByRole('button', { name: /add request/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('High Priority: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('toggling theme applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
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

  it('queue state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Persistent card')
    await u.click(screen.getByRole('button', { name: /add request/i }))
    await nav(u, 'Settings')
    await nav(u, 'Queue')
    expect(screen.getByText('Persistent card')).toBeInTheDocument()
  })

  it('Stats shows 100% completion when all requests are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Logo redesign'), 'done')
    await u.selectOptions(screen.getByLabelText('Status for Banner artwork'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
  })
})
