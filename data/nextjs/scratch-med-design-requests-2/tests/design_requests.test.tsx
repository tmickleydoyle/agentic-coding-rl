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
  it('starts on the Queue view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Queue' })).toBeInTheDocument()
    expect(screen.getByText('Logo redesign')).toBeInTheDocument()
    expect(screen.getByText('Banner artwork')).toBeInTheDocument()
    expect(screen.getByText('Icon set')).toBeInTheDocument()
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

  it('shows correct initial status counts on Queue view', () => {
    render(<App />)
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('In-progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('adds a new request with default status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Splash screen')
    expect(screen.getByText('Splash screen')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })

  it('ignores a blank title when adding', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add request/i }))
    expect(screen.getByText('New: 1')).toBeInTheDocument()
  })

  it('Set in-progress button moves a new request to in-progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /set logo redesign in-progress/i }))
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('In-progress: 2')).toBeInTheDocument()
  })

  it('Set in-progress button is disabled for already in-progress requests', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: /set banner artwork in-progress/i })
    ).toBeDisabled()
  })

  it('Set in-progress button is disabled for done requests', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: /set icon set in-progress/i })
    ).toBeDisabled()
  })

  it('Set done button moves a request to done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /set logo redesign done/i }))
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
  })

  it('Set done button is disabled for already done requests', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /set icon set done/i })).toBeDisabled()
  })

  it('filters list to show only new requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    expect(screen.getByText('Logo redesign')).toBeInTheDocument()
    expect(screen.queryByText('Banner artwork')).not.toBeInTheDocument()
    expect(screen.queryByText('Icon set')).not.toBeInTheDocument()
  })

  it('filters list to show only in-progress requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'in-progress')
    expect(screen.queryByText('Logo redesign')).not.toBeInTheDocument()
    expect(screen.getByText('Banner artwork')).toBeInTheDocument()
    expect(screen.queryByText('Icon set')).not.toBeInTheDocument()
  })

  it('filters list to show only done requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.queryByText('Logo redesign')).not.toBeInTheDocument()
    expect(screen.queryByText('Banner artwork')).not.toBeInTheDocument()
    expect(screen.getByText('Icon set')).toBeInTheDocument()
  })

  it('counts are unaffected by active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'new')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('In-progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('Stats view shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total requests: 3')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('In-progress: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('High priority: 1')).toBeInTheDocument()
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Stats completion updates after marking a request done (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /set logo redesign done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('Completion: 67%')).toBeInTheDocument()
  })

  it('Stats high priority count updates when high priority request is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Brand guide', 'high')
    await nav(u, 'Stats')
    expect(screen.getByText('High priority: 2')).toBeInTheDocument()
    expect(screen.getByText('Total requests: 4')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
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

  it('state persists when navigating away and back to Queue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Motion graphics', 'high')
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    expect(screen.getByText('Motion graphics')).toBeInTheDocument()
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })

  it('filter resets to all does not hide items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'all')
    expect(screen.getByText('Logo redesign')).toBeInTheDocument()
    expect(screen.getByText('Banner artwork')).toBeInTheDocument()
    expect(screen.getByText('Icon set')).toBeInTheDocument()
  })
})
