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

describe('Design Request Queue app', () => {
  it('starts on the Queue view with zero requests', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Requests (0)' })).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Requests (0)' })).toBeInTheDocument()
  })

  it('adds a request and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Logo redesign', 'high')
    expect(screen.getByText('Logo redesign')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Requests (1)' })).toBeInTheDocument()
  })

  it('ignores a blank request title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add request/i }))
    expect(screen.getByRole('heading', { name: 'Requests (0)' })).toBeInTheDocument()
  })

  it('new request starts with status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Banner design')
    const li = screen.getByText('Banner design').closest('li') as HTMLElement
    expect(within(li).getByLabelText('Status for Banner design')).toHaveValue('new')
  })

  it('changes request status inline', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Icon set')
    const statusSelect = screen.getByLabelText('Status for Icon set')
    await u.selectOptions(statusSelect, 'in-progress')
    expect(statusSelect).toHaveValue('in-progress')
  })

  it('priority is stored and shown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Header mockup', 'low')
    const li = screen.getByText('Header mockup').closest('li') as HTMLElement
    expect(within(li).getByText('low')).toBeInTheDocument()
  })

  it('filter by status hides non-matching requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Task A')
    await addRequest(u, 'Task B')
    await u.selectOptions(screen.getByLabelText('Status for Task B'), 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.queryByText('Task B')).not.toBeInTheDocument()
  })

  it('filter heading count reflects filtered list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Alpha')
    await addRequest(u, 'Beta')
    await u.selectOptions(screen.getByLabelText('Status for Beta'), 'in-progress')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'in-progress')
    expect(screen.getByRole('heading', { name: 'Requests (1)' })).toBeInTheDocument()
  })

  it('filter all shows all requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'X')
    await addRequest(u, 'Y')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByRole('heading', { name: 'Requests (2)' })).toBeInTheDocument()
  })

  it('Stats shows zero totals when no requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Stats reflects added requests (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'First')
    await addRequest(u, 'Second')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Stats completion percentage updates when requests are marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'P')
    await addRequest(u, 'Q')
    await u.selectOptions(screen.getByLabelText('Status for P'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('Stats counts in-progress correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'R')
    await addRequest(u, 'S')
    await u.selectOptions(screen.getByLabelText('Status for R'), 'in-progress')
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
  })

  it('Stats ignores active filter — counts all requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Filtered A')
    await addRequest(u, 'Filtered B')
    await u.selectOptions(screen.getByLabelText('Status for Filtered B'), 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('toggles theme to dark in Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across views', async () => {
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

  it('queue state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Persistent task', 'high')
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
  })

  it('filter state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Stay new')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    expect(screen.getByRole('heading', { name: 'Requests (0)' })).toBeInTheDocument()
  })
})
