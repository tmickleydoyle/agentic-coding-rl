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

describe('Design Request Queue (held-out)', () => {
  it('done percentage rounds correctly with 3 requests, 1 done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'req1')
    await addRequest(u, 'req2')
    await addRequest(u, 'req3')
    await u.click(within(reqRow('req1')).getByRole('button', { name: /set done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 33%')).toBeInTheDocument()
  })

  it('filter in-progress shows only in-progress items and correct count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'alpha')
    await addRequest(u, 'beta')
    await addRequest(u, 'gamma')
    await u.click(within(reqRow('alpha')).getByRole('button', { name: /set in-progress/i }))
    await u.click(within(reqRow('gamma')).getByRole('button', { name: /set in-progress/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'in-progress')
    expect(screen.getByRole('heading', { name: 'Requests (2)' })).toBeInTheDocument()
    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('gamma')).toBeInTheDocument()
    expect(screen.queryByText('beta')).not.toBeInTheDocument()
  })

  it('stats update after changing status multiple times', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'task')
    await u.click(within(reqRow('task')).getByRole('button', { name: /set in-progress/i }))
    await u.click(within(reqRow('task')).getByRole('button', { name: /set done/i }))
    await u.click(within(reqRow('task')).getByRole('button', { name: /set new/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('In-progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 0%')).toBeInTheDocument()
  })

  it('low priority requests are stored and shown correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Low prio task', 'low')
    expect(within(reqRow('Low prio task')).getByText('low')).toBeInTheDocument()
  })

  it('filter does not affect Stats counts (Stats uses all requests)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'visible')
    await addRequest(u, 'hidden')
    await u.click(within(reqRow('visible')).getByRole('button', { name: /set done/i }))
    await u.selectOptions(screen.getByLabelText(/filter by status/i), 'done')
    expect(screen.getByRole('heading', { name: 'Requests (1)' })).toBeInTheDocument()
    await nav(u, 'Stats')
    expect(screen.getByText('Total: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('Done: 1')).toBeInTheDocument()
  })

  it('theme toggle can be toggled back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('all three nav buttons are present', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Queue' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stats' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument()
  })

  it('100% done when all requests are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'only one')
    await u.click(within(reqRow('only one')).getByRole('button', { name: /set done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 100%')).toBeInTheDocument()
  })
})
