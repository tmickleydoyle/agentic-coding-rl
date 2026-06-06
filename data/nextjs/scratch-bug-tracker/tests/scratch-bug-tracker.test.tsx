import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Bug Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /bug tracker/i })).toBeInTheDocument()
  })

  it('shows 3 seed bugs', () => {
    expect(screen.getAllByTestId('bug-item')).toHaveLength(3)
  })

  it('shows correct open count', () => {
    expect(screen.getByTestId('count-open').textContent).toContain('1')
  })

  it('shows correct in-progress count', () => {
    expect(screen.getByTestId('count-in-progress').textContent).toContain('1')
  })

  it('shows correct closed count', () => {
    expect(screen.getByTestId('count-closed').textContent).toContain('1')
  })

  it('adds a new bug', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/title/i), 'New crash bug')
    await user.type(screen.getByLabelText(/assignee/i), 'Carol')
    await user.click(screen.getByRole('button', { name: /add bug/i }))
    expect(screen.getAllByTestId('bug-item')).toHaveLength(4)
    const titles = screen.getAllByTestId('bug-title').map(el => el.textContent)
    expect(titles).toContain('New crash bug')
  })

  it('does not add bug with empty title', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add bug/i }))
    expect(screen.getAllByTestId('bug-item')).toHaveLength(3)
  })

  it('clears form after add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/title/i), 'Temp')
    await user.click(screen.getByRole('button', { name: /add bug/i }))
    expect(screen.getByLabelText(/title/i)).toHaveValue('')
  })

  it('new bug defaults to open status', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/title/i), 'Status test')
    await user.click(screen.getByRole('button', { name: /add bug/i }))
    const items = screen.getAllByTestId('bug-item')
    const last = items[items.length - 1]
    expect(within(last).getByTestId('bug-status').textContent).toBe('open')
  })

  it('advances status: open -> in-progress', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('bug-item')
    const firstItem = items[0]
    expect(within(firstItem).getByTestId('bug-status').textContent).toBe('open')
    await user.click(within(firstItem).getByRole('button', { name: /next status/i }))
    expect(within(firstItem).getByTestId('bug-status').textContent).toBe('in-progress')
  })

  it('deletes a bug', async () => {
    const user = userEvent.setup()
    const items = screen.getAllByTestId('bug-item')
    await user.click(within(items[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getAllByTestId('bug-item')).toHaveLength(2)
  })

  it('filters bugs by status', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'closed')
    expect(screen.getAllByTestId('bug-item')).toHaveLength(1)
    expect(screen.getByTestId('bug-title').textContent).toBe('Export button missing')
  })

  it('global counts unchanged when filter applied', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'open')
    expect(screen.getByTestId('count-closed').textContent).toContain('1')
  })

  it('priority defaults to medium for new bug', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/title/i), 'Priority test')
    await user.click(screen.getByRole('button', { name: /add bug/i }))
    const items = screen.getAllByTestId('bug-item')
    const last = items[items.length - 1]
    expect(within(last).getByTestId('bug-priority').textContent).toBe('medium')
  })
})
