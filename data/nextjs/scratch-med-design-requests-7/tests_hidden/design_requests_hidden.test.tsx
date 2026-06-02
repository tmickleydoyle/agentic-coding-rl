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

describe('Design Request Queue (held-out)', () => {
  it('adding multiple requests increments Showing count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Request A')
    await addRequest(u, 'Request B')
    await addRequest(u, 'Request C')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('stats high priority count reflects only high priority items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Low item', 'low')
    await addRequest(u, 'Medium item', 'medium')
    await addRequest(u, 'High item 1', 'high')
    await addRequest(u, 'High item 2', 'high')
    await nav(u, 'Stats')
    expect(screen.getByText('High priority: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 4')).toBeInTheDocument()
  })

  it('in-progress filter shows only in-progress requests among several', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Task P')
    await addRequest(u, 'Task Q')
    await addRequest(u, 'Task R')
    await u.click(within(reqRow('Task Q')).getByRole('button', { name: /set in-progress task q/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'in-progress')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Task Q')).toBeInTheDocument()
    expect(screen.queryByText('Task P')).not.toBeInTheDocument()
    expect(screen.queryByText('Task R')).not.toBeInTheDocument()
  })

  it('done filter hides new and in-progress items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Alpha')
    await addRequest(u, 'Beta')
    await u.click(within(reqRow('Alpha')).getByRole('button', { name: /set in-progress alpha/i }))
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    expect(screen.getByText('Showing: 0')).toBeInTheDocument()
  })

  it('set done after set in-progress works correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Workflow test')
    await u.click(within(reqRow('Workflow test')).getByRole('button', { name: /set in-progress workflow test/i }))
    await u.click(within(reqRow('Workflow test')).getByRole('button', { name: /set done workflow test/i }))
    expect(within(reqRow('Workflow test')).getByText('done')).toBeInTheDocument()
    expect(within(reqRow('Workflow test')).getByRole('button', { name: /set done workflow test/i })).toBeDisabled()
  })

  it('stats new count decrements when a request moves to in-progress', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Watch me move')
    await nav(u, 'Stats')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    await nav(u, 'Queue')
    await u.click(within(reqRow('Watch me move')).getByRole('button', { name: /set in-progress watch me move/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('In-progress: 1')).toBeInTheDocument()
  })

  it('filter selection survives navigating to settings and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'in-progress')
    await nav(u, 'Settings')
    await nav(u, 'Queue')
    expect(screen.getByLabelText('Filter by status')).toHaveValue('in-progress')
  })

  it('shows low priority on request row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Minor tweak', 'low')
    expect(within(reqRow('Minor tweak')).getByText('low')).toBeInTheDocument()
  })

  it('done stat increments when requests are marked done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Finish A')
    await addRequest(u, 'Finish B')
    await u.click(within(reqRow('Finish A')).getByRole('button', { name: /set done finish a/i }))
    await u.click(within(reqRow('Finish B')).getByRole('button', { name: /set done finish b/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
  })
})
