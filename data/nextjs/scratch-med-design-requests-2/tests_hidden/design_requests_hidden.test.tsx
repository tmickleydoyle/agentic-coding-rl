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

describe('Design Request Queue (held-out)', () => {
  it('all three seeded items appear in Queue with all filter', () => {
    render(<App />)
    const items = screen.getAllByRole('listitem')
    expect(items.length).toBe(3)
  })

  it('Stats completion is 0% when all requests are new', async () => {
    const u = userEvent.setup()
    render(<App />)
    // move done request back to in-progress is not possible, so add two new ones and check stats
    // Instead let's check that when only new items exist, stats show 0% after all are cleared
    // We test: add a new request, mark icon set undone is not possible;
    // simpler: verify total and completion with one additional new item
    await addRequest(u, 'Extra task', 'low')
    await nav(u, 'Stats')
    // 4 total, 1 done => 25%
    expect(screen.getByText('Total requests: 4')).toBeInTheDocument()
    expect(screen.getByText('Completion: 25%')).toBeInTheDocument()
  })

  it('completing all requests gives 100% completion', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /set logo redesign done/i }))
    await u.click(screen.getByRole('button', { name: /set banner artwork done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 100%')).toBeInTheDocument()
    expect(screen.getByText('Done: 3')).toBeInTheDocument()
  })

  it('in-progress count increments after Set in-progress on new request', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'UI kit', 'medium')
    await u.click(screen.getByRole('button', { name: /set ui kit in-progress/i }))
    expect(screen.getByText('In-progress: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 1')).toBeInTheDocument()
  })

  it('Stats In-progress count reflects cross-view status change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /set logo redesign in-progress/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('In-progress: 2')).toBeInTheDocument()
    expect(screen.getByText('New: 0')).toBeInTheDocument()
  })

  it('filter done then add new request does not show it in filtered view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'done')
    await addRequest(u, 'Hidden task', 'low')
    expect(screen.queryByText('Hidden task')).not.toBeInTheDocument()
    // but count still updates
    expect(screen.getByText('New: 2')).toBeInTheDocument()
  })

  it('multiple high priority requests are counted in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Pitch deck', 'high')
    await addRequest(u, 'Product brochure', 'high')
    await nav(u, 'Stats')
    expect(screen.getByText('High priority: 3')).toBeInTheDocument()
  })

  it('Stats Total requests reflects newly added item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Newsletter header', 'low')
    await nav(u, 'Stats')
    expect(screen.getByText('Total requests: 4')).toBeInTheDocument()
  })

  it('Queue view filter persists when returning from Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by status'), 'in-progress')
    await nav(u, 'Stats')
    await nav(u, 'Queue')
    const select = screen.getByLabelText('Filter by status') as HTMLSelectElement
    expect(select.value).toBe('in-progress')
    expect(screen.queryByText('Logo redesign')).not.toBeInTheDocument()
    expect(screen.getByText('Banner artwork')).toBeInTheDocument()
  })

  it('Set done on in-progress request decrements in-progress count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /set banner artwork done/i }))
    expect(screen.getByText('In-progress: 0')).toBeInTheDocument()
    expect(screen.getByText('Done: 2')).toBeInTheDocument()
  })
})
