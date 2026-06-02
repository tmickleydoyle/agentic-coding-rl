// HELD-OUT generalization tests — different inputs, edge cases, and cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBug(u: U, title: string, severity: string = 'low') {
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
  it('adds multiple bugs and count updates correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Alpha bug', 'low')
    await addBug(u, 'Beta bug', 'medium')
    await addBug(u, 'Gamma bug', 'high')
    expect(screen.getByRole('heading', { name: /bugs \(3\)/i })).toBeInTheDocument()
  })

  it('filter count drops to zero when all bugs are closed and Open filter active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Bug1')
    await addBug(u, 'Bug2')
    await u.click(screen.getByRole('button', { name: /close bug bug1/i }))
    await u.click(screen.getByRole('button', { name: /close bug bug2/i }))
    await u.click(screen.getByRole('button', { name: 'Open', pressed: false }))
    expect(screen.getByRole('heading', { name: /bugs \(0\)/i })).toBeInTheDocument()
  })

  it('switching back to All after Open filter restores full count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'X')
    await addBug(u, 'Y')
    await u.click(screen.getByRole('button', { name: 'Open', pressed: false }))
    expect(screen.getByRole('heading', { name: /bugs \(2\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All', pressed: false }))
    expect(screen.getByRole('heading', { name: /bugs \(2\)/i })).toBeInTheDocument()
  })

  it('Closed filter shows correct count after multiple closes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Fix1', 'high')
    await addBug(u, 'Fix2', 'low')
    await addBug(u, 'Fix3', 'medium')
    await u.click(screen.getByRole('button', { name: /close bug fix1/i }))
    await u.click(screen.getByRole('button', { name: /close bug fix3/i }))
    await u.click(screen.getByRole('button', { name: 'Closed', pressed: false }))
    expect(screen.getByRole('heading', { name: /bugs \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('Fix1')).toBeInTheDocument()
    expect(screen.getByText('Fix3')).toBeInTheDocument()
    expect(screen.queryByText('Fix2')).not.toBeInTheDocument()
  })

  it('Stats medium open count is correct with mixed severities', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'M1', 'medium')
    await addBug(u, 'M2', 'medium')
    await addBug(u, 'H1', 'high')
    await u.click(screen.getByRole('button', { name: /close bug m1/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Medium open: 1')).toBeInTheDocument()
    expect(screen.getByText('High open: 1')).toBeInTheDocument()
    expect(screen.getByText('Low open: 0')).toBeInTheDocument()
  })

  it('Stats total includes closed bugs', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'P', 'high')
    await addBug(u, 'Q', 'high')
    await u.click(screen.getByRole('button', { name: /close bug p/i }))
    await u.click(screen.getByRole('button', { name: /close bug q/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('Open: 0')).toBeInTheDocument()
    expect(screen.getByText('Closed: 2')).toBeInTheDocument()
    expect(screen.getByText('High open: 0')).toBeInTheDocument()
  })

  it('theme toggles back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme.*light/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme.*dark/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('bug list filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Persist open')
    await addBug(u, 'Persist closed')
    await u.click(screen.getByRole('button', { name: /close bug persist closed/i }))
    await u.click(screen.getByRole('button', { name: 'Open', pressed: false }))
    await nav(u, 'Stats')
    await nav(u, 'Bugs')
    // filter should still be Open
    expect(screen.getByRole('button', { name: 'Open', pressed: true })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /bugs \(1\)/i })).toBeInTheDocument()
  })

  it('a closed bug still appears in the All filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBug(u, 'Visible always', 'low')
    await u.click(screen.getByRole('button', { name: /close bug visible always/i }))
    expect(screen.getByText('Visible always')).toBeInTheDocument()
    expect(within(bugRow('Visible always')).getByText('Closed')).toBeInTheDocument()
  })

  it('Stats view is accessible and shows heading', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
  })
})
