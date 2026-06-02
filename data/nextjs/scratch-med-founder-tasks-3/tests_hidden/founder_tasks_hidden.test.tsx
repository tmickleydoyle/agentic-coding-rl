import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addTask(u: U, title: string, priority: string = 'High') {
  await u.clear(screen.getByLabelText(/task name/i))
  await u.type(screen.getByLabelText(/task name/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}

describe('Founder Task Tracker (held-out)', () => {
  it('multiple tasks each show their correct priority labels', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Thing one', 'High')
    await addTask(u, 'Thing two', 'Medium')
    await addTask(u, 'Thing three', 'Low')
    const li1 = screen.getByText('Thing one').closest('li') as HTMLElement
    const li2 = screen.getByText('Thing two').closest('li') as HTMLElement
    const li3 = screen.getByText('Thing three').closest('li') as HTMLElement
    expect(within(li1).getByText('High')).toBeInTheDocument()
    expect(within(li2).getByText('Medium')).toBeInTheDocument()
    expect(within(li3).getByText('Low')).toBeInTheDocument()
  })

  it('filter by Medium hides High and Low tasks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'High task', 'High')
    await addTask(u, 'Med task', 'Medium')
    await addTask(u, 'Low task', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Medium')
    expect(screen.getByText('Med task')).toBeInTheDocument()
    expect(screen.queryByText('High task')).not.toBeInTheDocument()
    expect(screen.queryByText('Low task')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 1 of 3 tasks')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'H', 'High')
    await addTask(u, 'L', 'Low')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Low')
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('Showing: 1 of 2 tasks')).toBeInTheDocument()
    expect(screen.getByText('L')).toBeInTheDocument()
    expect(screen.queryByText('H')).not.toBeInTheDocument()
  })

  it('done status persists across navigation', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Checkit', 'Medium')
    await u.click(screen.getByRole('button', { name: /toggle done checkit/i }))
    await nav(u, 'Stats')
    await nav(u, 'Tasks')
    expect(screen.getByText('✓ Checkit')).toBeInTheDocument()
  })

  it('stats pending count equals total minus done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'P1', 'High')
    await addTask(u, 'P2', 'High')
    await addTask(u, 'P3', 'Low')
    await u.click(screen.getByRole('button', { name: /toggle done p1/i }))
    await u.click(screen.getByRole('button', { name: /toggle done p3/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Pending: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('stats done% rounds to 50 for two tasks one done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'First', 'High')
    await addTask(u, 'Second', 'High')
    await u.click(screen.getByRole('button', { name: /toggle done first/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 50%')).toBeInTheDocument()
  })

  it('deleting a done task reduces done count in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Temp', 'Low')
    await u.click(screen.getByRole('button', { name: /toggle done temp/i }))
    await u.click(screen.getByRole('button', { name: /delete temp/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
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

  it('settings button shows current theme name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('button', { name: /current: light/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByRole('button', { name: /current: dark/i })).toBeInTheDocument()
  })

  it('showing 0 of N tasks when filter matches nothing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Only high', 'High')
    await u.selectOptions(screen.getByLabelText(/filter by priority/i), 'Low')
    expect(screen.getByText('Showing: 0 of 1 tasks')).toBeInTheDocument()
  })
})
