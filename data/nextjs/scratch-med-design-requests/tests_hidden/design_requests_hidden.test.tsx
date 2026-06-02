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
  it('adds multiple requests and count updates each time', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Brochure layout')
    expect(screen.getByRole('heading', { name: 'Requests (1)' })).toBeInTheDocument()
    await addRequest(u, 'Social media kit')
    expect(screen.getByRole('heading', { name: 'Requests (2)' })).toBeInTheDocument()
    await addRequest(u, 'Email template')
    expect(screen.getByRole('heading', { name: 'Requests (3)' })).toBeInTheDocument()
  })

  it('high priority request is stored and visible', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Urgent campaign', 'high')
    const li = screen.getByText('Urgent campaign').closest('li') as HTMLElement
    expect(within(li).getByText('high')).toBeInTheDocument()
  })

  it('status change to done is reflected in stats completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'One')
    await addRequest(u, 'Two')
    await addRequest(u, 'Three')
    await u.selectOptions(screen.getByLabelText('Status for One'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('all three items done yields 100% completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'A')
    await addRequest(u, 'B')
    await u.selectOptions(screen.getByLabelText('Status for A'), 'done')
    await u.selectOptions(screen.getByLabelText('Status for B'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
  })

  it('filter by in-progress shows only in-progress items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Design sprint')
    await addRequest(u, 'Brand refresh')
    await addRequest(u, 'Poster')
    await u.selectOptions(screen.getByLabelText('Status for Brand refresh'), 'in-progress')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'in-progress')
    expect(screen.queryByText('Design sprint')).not.toBeInTheDocument()
    expect(screen.getByText('Brand refresh')).toBeInTheDocument()
    expect(screen.queryByText('Poster')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Requests (1)' })).toBeInTheDocument()
  })

  it('filter by done shows only done items and correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Done item')
    await addRequest(u, 'Not done')
    await u.selectOptions(screen.getByLabelText('Status for Done item'), 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.getByText('Done item')).toBeInTheDocument()
    expect(screen.queryByText('Not done')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Requests (1)' })).toBeInTheDocument()
  })

  it('stats In Progress count updates after status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Mockup')
    await u.selectOptions(screen.getByLabelText('Status for Mockup'), 'in-progress')
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
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

  it('requests added after filtering still appear under all filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Earlier task')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    await addRequest(u, 'Later task')
    expect(screen.getByRole('heading', { name: 'Requests (2)' })).toBeInTheDocument()
    expect(screen.getByText('Later task')).toBeInTheDocument()
  })

  it('status can be changed back to new after being set to done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Reversible')
    await u.selectOptions(screen.getByLabelText('Status for Reversible'), 'done')
    await u.selectOptions(screen.getByLabelText('Status for Reversible'), 'new')
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })
})
