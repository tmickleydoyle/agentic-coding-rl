// HELD-OUT generalization tests — fresh scenarios, edge cases, cross-view paths.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

describe('Design Request Queue (held-out)', () => {
  it('filter in-progress shows only Banner artwork initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'in-progress')
    expect(screen.getByText('Banner artwork')).toBeInTheDocument()
    expect(screen.queryByText('Logo redesign')).not.toBeInTheDocument()
    expect(screen.queryByText('Icon set')).not.toBeInTheDocument()
  })

  it('filter new shows only Logo redesign initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    expect(screen.getByText('Logo redesign')).toBeInTheDocument()
    expect(screen.queryByText('Banner artwork')).not.toBeInTheDocument()
    expect(screen.queryByText('Icon set')).not.toBeInTheDocument()
  })

  it('newly added request appears under filter new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Newsletter template')
    await u.selectOptions(screen.getByLabelText('Priority'), 'medium')
    await u.click(screen.getByRole('button', { name: /add request/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    expect(screen.getByText('Newsletter template')).toBeInTheDocument()
  })

  it('changing status to done removes item under new filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Logo redesign'), 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    expect(screen.queryByText('Logo redesign')).not.toBeInTheDocument()
  })

  it('Stats In Progress count updates after status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Banner artwork'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
  })

  it('Stats Total increases after adding a request', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'App icon')
    await u.click(screen.getByRole('button', { name: /add request/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })

  it('Stats New count is 0 when all moved to done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Status for Logo redesign'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
  })

  it('multiple high priority requests reflected in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Pitch deck')
    await u.selectOptions(screen.getByLabelText('Priority'), 'high')
    await u.click(screen.getByRole('button', { name: /add request/i }))
    await u.clear(screen.getByLabelText('Title'))
    await u.type(screen.getByLabelText('Title'), 'Trade show banner')
    await u.selectOptions(screen.getByLabelText('Priority'), 'high')
    await u.click(screen.getByRole('button', { name: /add request/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('High Priority: 3')).toBeInTheDocument()
  })

  it('Completion is 50% when 2 of 4 are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Title'), 'Extra card')
    await u.click(screen.getByRole('button', { name: /add request/i }))
    await u.selectOptions(screen.getByLabelText('Status for Logo redesign'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
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

  it('theme is dark when navigating Queue -> Settings -> Stats after toggle', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Queue')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })
})
