import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addRequest(u: U, title: string, priority = 'medium') {
  await u.clear(screen.getByLabelText(/^title$/i))
  await u.type(screen.getByLabelText(/^title$/i), title)
  await u.selectOptions(screen.getByLabelText(/^priority$/i), priority)
  await u.click(screen.getByRole('button', { name: /add request/i }))
}

function reqRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Design Request Queue app', () => {
  it('starts on the Queue view with empty state', () => {
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
    await addRequest(u, 'Redesign homepage')
    expect(screen.getByText('Redesign homepage')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Requests (1)' })).toBeInTheDocument()
  })

  it('ignores a blank title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add request/i }))
    expect(screen.getByRole('heading', { name: 'Requests (0)' })).toBeInTheDocument()
  })

  it('new request starts with status new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Logo refresh')
    expect(within(reqRow('Logo refresh')).getByText('new')).toBeInTheDocument()
  })

  it('stores priority on the request row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Banner design', 'high')
    expect(within(reqRow('Banner design')).getByText('high')).toBeInTheDocument()
  })

  it('sets a request to in-progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Icon set')
    await u.click(within(reqRow('Icon set')).getByRole('button', { name: /set in-progress/i }))
    expect(within(reqRow('Icon set')).getByText('in-progress')).toBeInTheDocument()
  })

  it('sets a request to done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Brochure')
    await u.click(within(reqRow('Brochure')).getByRole('button', { name: /set done/i }))
    expect(within(reqRow('Brochure')).getByText('done')).toBeInTheDocument()
  })

  it('sets a request back to new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Slide deck')
    await u.click(within(reqRow('Slide deck')).getByRole('button', { name: /set done/i }))
    await u.click(within(reqRow('Slide deck')).getByRole('button', { name: /set new/i }))
    expect(within(reqRow('Slide deck')).getByText('new')).toBeInTheDocument()
  })

  it('filter by status hides non-matching requests and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Poster')
    await addRequest(u, 'Flyer')
    await u.click(within(reqRow('Poster')).getByRole('button', { name: /set done/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'done')
    expect(screen.getByRole('heading', { name: 'Requests (1)' })).toBeInTheDocument()
    expect(screen.getByText('Poster')).toBeInTheDocument()
    expect(screen.queryByText('Flyer')).not.toBeInTheDocument()
  })

  it('filter all shows every request', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'A')
    await addRequest(u, 'B')
    await u.click(within(reqRow('A')).getByRole('button', { name: /set in-progress/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'in-progress')
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'all')
    expect(screen.getByRole('heading', { name: 'Requests (2)' })).toBeInTheDocument()
  })

  it('Stats shows 0% and all zeros when empty (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 0')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('In-progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('Stats reflects requests added in Queue (cross-view shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'X')
    await addRequest(u, 'Y')
    await u.click(within(reqRow('X')).getByRole('button', { name: /set done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 50%')).toBeInTheDocument()
  })

  it('Stats in-progress count updates correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'P')
    await addRequest(u, 'Q')
    await u.click(within(reqRow('P')).getByRole('button', { name: /set in-progress/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('In-progress: 1')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Persistent request')
    await nav(u, 'Settings')
    await nav(u, 'Queue')
    expect(screen.getByText('Persistent request')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Stats')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Queue')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('adds multiple requests and heading count is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'R1')
    await addRequest(u, 'R2')
    await addRequest(u, 'R3')
    expect(screen.getByRole('heading', { name: 'Requests (3)' })).toBeInTheDocument()
  })

  it('filter by new shows only new requests', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'N1')
    await addRequest(u, 'N2')
    await u.click(within(reqRow('N1')).getByRole('button', { name: /set in-progress/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'new')
    expect(screen.getByRole('heading', { name: 'Requests (1)' })).toBeInTheDocument()
    expect(screen.queryByText('N1')).not.toBeInTheDocument()
    expect(screen.getByText('N2')).toBeInTheDocument()
  })
})
