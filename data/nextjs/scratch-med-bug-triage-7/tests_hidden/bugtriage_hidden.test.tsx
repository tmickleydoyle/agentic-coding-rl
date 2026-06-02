// HELD-OUT generalization tests — fresh scenarios not in the visible suite
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: string = 'Low') {
  await u.clear(screen.getByLabelText('Title'))
  await u.type(screen.getByLabelText('Title'), title)
  await u.selectOptions(screen.getByLabelText('Severity'), severity)
  await u.click(screen.getByRole('button', { name: /add bug/i }))
}

function bugRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Bug Triage (held-out)', () => {
  it('empty Stats view shows zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 0')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
    expect(screen.getByText('High (open): 0')).toBeInTheDocument()
    expect(screen.getByText('Medium (open): 0')).toBeInTheDocument()
    expect(screen.getByText('Low (open): 0')).toBeInTheDocument()
  })

  it('closing and reopening updates Stats open/closed counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Flicker', 'Medium')
    await u.click(within(bugRow('Flicker')).getByRole('button', { name: /close flicker/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 1')).toBeInTheDocument()
    await nav(u, 'Bugs')
    await u.click(within(bugRow('Flicker')).getByRole('button', { name: /reopen flicker/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Closed: 0')).toBeInTheDocument()
  })

  it('High (open) count updates when bug is closed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Critical one', 'High')
    await addBug(u, 'Critical two', 'High')
    await u.click(within(bugRow('Critical one')).getByRole('button', { name: /close critical one/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('High (open): 1')).toBeInTheDocument()
  })

  it('filter by Closed then switching to All restores full count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Issue P')
    await addBug(u, 'Issue Q')
    await addBug(u, 'Issue R')
    await u.click(within(bugRow('Issue P')).getByRole('button', { name: /close issue p/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Closed')
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'All')
    expect(screen.getByRole('heading', { name: 'Bugs (3)' })).toBeInTheDocument()
  })

  it('multiple Medium open bugs counted correctly in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Med A', 'Medium')
    await addBug(u, 'Med B', 'Medium')
    await addBug(u, 'Med C', 'Medium')
    await u.click(within(bugRow('Med C')).getByRole('button', { name: /close med c/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Medium (open): 2')).toBeInTheDocument()
    expect(screen.getByText('Total bugs: 3')).toBeInTheDocument()
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

  it('Reopen becomes enabled after closing and disabled again after reopening', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Toggle me', 'Low')
    expect(within(bugRow('Toggle me')).getByRole('button', { name: /reopen toggle me/i })).toBeDisabled()
    await u.click(within(bugRow('Toggle me')).getByRole('button', { name: /close toggle me/i }))
    expect(within(bugRow('Toggle me')).getByRole('button', { name: /reopen toggle me/i })).not.toBeDisabled()
    await u.click(within(bugRow('Toggle me')).getByRole('button', { name: /reopen toggle me/i }))
    expect(within(bugRow('Toggle me')).getByRole('button', { name: /reopen toggle me/i })).toBeDisabled()
  })

  it('filter state is local to Bugs view and does not affect Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Show only open', 'High')
    await addBug(u, 'Now closed', 'High')
    await u.click(within(bugRow('Now closed')).getByRole('button', { name: /close now closed/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'Open')
    expect(screen.getByRole('heading', { name: 'Bugs (1)' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total bugs: 2')).toBeInTheDocument()
    expect(screen.getByText('High (open): 1')).toBeInTheDocument()
  })
})
