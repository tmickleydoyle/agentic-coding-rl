import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addRequest(u: U, title: string, priority: 'low' | 'medium' | 'high' = 'low') {
  await u.clear(screen.getByLabelText(/title/i))
  await u.type(screen.getByLabelText(/title/i), title)
  await u.selectOptions(screen.getByLabelText(/priority/i), priority)
  await u.click(screen.getByRole('button', { name: /add request/i }))
}

function reqRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Design Request Queue app', () => {
  it('starts on the Queue view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
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

  it('shows empty state with Showing: 0 requests', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0 requests')).toBeInTheDocument()
  })

  it('adds a request and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'New logo design')
    expect(screen.getByText('New logo design')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1 requests')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add request/i }))
    expect(screen.getByText('Showing: 0 requests')).toBeInTheDocument()
  })

  it('new request starts with status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Banner update')
    expect(within(reqRow('Banner update')).getByText('new')).toBeInTheDocument()
  })

  it('sets a request to in-progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Homepage redesign')
    await u.click(within(reqRow('Homepage redesign')).getByRole('button', { name: /set homepage redesign in-progress/i }))
    expect(within(reqRow('Homepage redesign')).getByText('in-progress')).toBeInTheDocument()
  })

  it('Set in-progress button is disabled when already in-progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Icon set')
    await u.click(within(reqRow('Icon set')).getByRole('button', { name: /set icon set in-progress/i }))
    expect(within(reqRow('Icon set')).getByRole('button', { name: /set icon set in-progress/i })).toBeDisabled()
  })

  it('sets a request to done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Email template')
    await u.click(within(reqRow('Email template')).getByRole('button', { name: /set email template done/i }))
    expect(within(reqRow('Email template')).getByText('done')).toBeInTheDocument()
  })

  it('Set done button is disabled when already done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Brochure')
    await u.click(within(reqRow('Brochure')).getByRole('button', { name: /set brochure done/i }))
    expect(within(reqRow('Brochure')).getByRole('button', { name: /set brochure done/i })).toBeDisabled()
  })

  it('filter buttons show correct counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'R1')
    await addRequest(u, 'R2')
    await addRequest(u, 'R3')
    await u.click(within(reqRow('R1')).getByRole('button', { name: /set r1 in-progress/i }))
    await u.click(within(reqRow('R2')).getByRole('button', { name: /set r2 done/i }))
    expect(screen.getByRole('button', { name: 'All (3)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'new (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'in-progress (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'done (1)' })).toBeInTheDocument()
  })

  it('filters the visible list by status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Alpha')
    await addRequest(u, 'Beta')
    await u.click(within(reqRow('Alpha')).getByRole('button', { name: /set alpha done/i }))
    await u.click(screen.getByRole('button', { name: /^done \(/ }))
    expect(screen.getByText('Showing: 1 requests')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('All filter shows all requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'X')
    await addRequest(u, 'Y')
    await u.click(within(reqRow('X')).getByRole('button', { name: /set x done/i }))
    await u.click(screen.getByRole('button', { name: /^done \(/ }))
    await u.click(screen.getByRole('button', { name: /^All \(/ }))
    expect(screen.getByText('Showing: 2 requests')).toBeInTheDocument()
  })

  it('Stats view shows derived totals (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'T1', 'high')
    await addRequest(u, 'T2', 'low')
    await u.click(within(reqRow('T1')).getByRole('button', { name: /set t1 done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('High Priority: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 50%')).toBeInTheDocument()
  })

  it('Stats shows 0% completion when no requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('Completion: 0%')).toBeInTheDocument()
  })

  it('Stats shows In Progress count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Slide deck')
    await u.click(within(reqRow('Slide deck')).getByRole('button', { name: /set slide deck in-progress/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
  })

  it('toggles theme and persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Queue')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('queue state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Persistent task', 'medium')
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    expect(screen.getByText('Persistent task')).toBeInTheDocument()
  })
})
