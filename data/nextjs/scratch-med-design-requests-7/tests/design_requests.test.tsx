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

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByRole('heading', { name: 'Stats' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Queue')
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
  })

  it('shows Showing: 0 initially', () => {
    render(<App />)
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('adds a request and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Logo redesign')
    expect(screen.getByText('Logo redesign')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add request/i }))
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('new request starts with status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Banner art')
    expect(within(reqRow('Banner art')).getByText('new')).toBeInTheDocument()
  })

  it('sets a request to in-progress and disables that button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Icon set')
    await u.click(within(reqRow('Icon set')).getByRole('button', { name: /set in-progress icon set/i }))
    expect(within(reqRow('Icon set')).getByText('in-progress')).toBeInTheDocument()
    expect(within(reqRow('Icon set')).getByRole('button', { name: /set in-progress icon set/i })).toBeDisabled()
  })

  it('sets a request to done and disables that button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Splash screen')
    await u.click(within(reqRow('Splash screen')).getByRole('button', { name: /set done splash screen/i }))
    expect(within(reqRow('Splash screen')).getByText('done')).toBeInTheDocument()
    expect(within(reqRow('Splash screen')).getByRole('button', { name: /set done splash screen/i })).toBeDisabled()
  })

  it('filters by new status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Alpha')
    await addRequest(u, 'Beta')
    await u.click(within(reqRow('Alpha')).getByRole('button', { name: /set done alpha/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('filters by in-progress status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Card')
    await addRequest(u, 'Header')
    await u.click(within(reqRow('Card')).getByRole('button', { name: /set in-progress card/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'in-progress')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Card')).toBeInTheDocument()
    expect(screen.queryByText('Header')).not.toBeInTheDocument()
  })

  it('filters by done status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Nav bar')
    await addRequest(u, 'Footer')
    await u.click(within(reqRow('Footer')).getByRole('button', { name: /set done footer/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
    expect(screen.queryByText('Nav bar')).not.toBeInTheDocument()
  })

  it('filter all shows all requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'One')
    await addRequest(u, 'Two')
    await addRequest(u, 'Three')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Persist me')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    expect(screen.getByLabelText('Filter by status')).toHaveValue('done')
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('stats view shows correct totals (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'X', 'high')
    await addRequest(u, 'Y', 'low')
    await addRequest(u, 'Z', 'high')
    await u.click(within(reqRow('X')).getByRole('button', { name: /set in-progress x/i }))
    await u.click(within(reqRow('Z')).getByRole('button', { name: /set done z/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('In-progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('High priority: 2')).toBeInTheDocument()
  })

  it('stats shows zero totals when no requests exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('High priority: 0')).toBeInTheDocument()
  })

  it('stats counts all requests regardless of active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Filtered out', 'medium')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
  })

  it('toggles theme to dark and back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
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

  it('priority is stored and shown on the request row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'High stakes', 'high')
    expect(within(reqRow('High stakes')).getByText('high')).toBeInTheDocument()
  })

  it('queue state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Persistent request')
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    expect(screen.getByText('Persistent request')).toBeInTheDocument()
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })
})
