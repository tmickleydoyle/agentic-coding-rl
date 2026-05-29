import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Feed from '../components/Feed'
import type { Post } from '../components/types'

type Resolve = (v: { items: Post[]; hasMore: boolean }) => void
type Reject = (e: unknown) => void

// A controllable loader: each call returns a pending promise we resolve/reject by hand.
function makeLoader() {
  const calls: { page: number; resolve: Resolve; reject: Reject }[] = []
  const load = (page: number) =>
    new Promise<{ items: Post[]; hasMore: boolean }>((resolve, reject) => {
      calls.push({ page, resolve, reject })
    })
  return { load, calls }
}

async function settle(fn: () => void) {
  await act(async () => {
    fn()
    await Promise.resolve()
    await Promise.resolve()
  })
}

const page = (ids: number[]): Post[] => ids.map((id) => ({ id, title: `Post ${id}` }))

describe('Infinite feed', () => {
  it('starts empty with an enabled Load more', () => {
    const { load } = makeLoader()
    render(<Feed load={load} />)
    expect(screen.queryAllByTestId(/^post-/)).toHaveLength(0)
    expect(screen.getByTestId('load-more')).not.toBeDisabled()
    expect(screen.queryByTestId('end')).toBeNull()
  })

  it('shows a loading state while a page is in flight', async () => {
    const { load, calls } = makeLoader()
    const user = userEvent.setup()
    render(<Feed load={load} />)
    await user.click(screen.getByTestId('load-more'))
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByTestId('load-more')).toBeDisabled()
    await settle(() => calls[0].resolve({ items: page([1, 2]), hasMore: true }))
    expect(screen.queryByTestId('loading')).toBeNull()
  })

  it('appends a resolved page to the feed', async () => {
    const { load, calls } = makeLoader()
    const user = userEvent.setup()
    render(<Feed load={load} />)
    await user.click(screen.getByTestId('load-more'))
    await settle(() => calls[0].resolve({ items: page([1, 2, 3]), hasMore: true }))
    expect(screen.getAllByTestId(/^post-/).map((li) => li.getAttribute('data-testid'))).toEqual([
      'post-1',
      'post-2',
      'post-3',
    ])
  })

  it('requests incrementing pages and appends across loads', async () => {
    const { load, calls } = makeLoader()
    const user = userEvent.setup()
    render(<Feed load={load} />)
    await user.click(screen.getByTestId('load-more'))
    await settle(() => calls[0].resolve({ items: page([1, 2]), hasMore: true }))
    await user.click(screen.getByTestId('load-more'))
    await settle(() => calls[1].resolve({ items: page([3, 4]), hasMore: true }))
    expect(calls.map((c) => c.page)).toEqual([0, 1])
    expect(screen.getAllByTestId(/^post-/)).toHaveLength(4)
  })

  it('dedupes items that share an id with already-loaded items', async () => {
    const { load, calls } = makeLoader()
    const user = userEvent.setup()
    render(<Feed load={load} />)
    await user.click(screen.getByTestId('load-more'))
    await settle(() => calls[0].resolve({ items: page([1, 2]), hasMore: true }))
    await user.click(screen.getByTestId('load-more'))
    await settle(() => calls[1].resolve({ items: page([2, 3]), hasMore: true }))
    expect(screen.getAllByTestId(/^post-/).map((li) => li.getAttribute('data-testid'))).toEqual([
      'post-1',
      'post-2',
      'post-3',
    ])
  })

  it('shows a terminal "No more" and disables the button when exhausted', async () => {
    const { load, calls } = makeLoader()
    const user = userEvent.setup()
    render(<Feed load={load} />)
    await user.click(screen.getByTestId('load-more'))
    await settle(() => calls[0].resolve({ items: page([1]), hasMore: false }))
    expect(screen.getByTestId('end')).toBeInTheDocument()
    expect(screen.getByTestId('load-more')).toBeDisabled()
  })

  it('ignores extra clicks while a page is loading (one request)', async () => {
    const { load, calls } = makeLoader()
    const user = userEvent.setup()
    render(<Feed load={load} />)
    await user.click(screen.getByTestId('load-more'))
    await user.click(screen.getByTestId('load-more'))
    expect(calls).toHaveLength(1)
    await settle(() => calls[0].resolve({ items: page([1]), hasMore: true }))
  })

  it('surfaces a rejection as an error and recovers on retry', async () => {
    const { load, calls } = makeLoader()
    const user = userEvent.setup()
    render(<Feed load={load} />)
    await user.click(screen.getByTestId('load-more'))
    await settle(() => calls[0].reject(new Error('boom')))
    expect(screen.getByTestId('error')).toHaveTextContent('boom')
    expect(screen.queryByTestId('loading')).toBeNull()
    expect(screen.getByTestId('load-more')).not.toBeDisabled()
    // retry hits page 0 again (page was not advanced) and clears the error
    await user.click(screen.getByTestId('load-more'))
    expect(calls[1].page).toBe(0)
    await settle(() => calls[1].resolve({ items: page([1]), hasMore: true }))
    expect(screen.queryByTestId('error')).toBeNull()
    expect(screen.getByTestId('post-1')).toBeInTheDocument()
  })

  it('does not show the end state before any successful load', () => {
    const { load } = makeLoader()
    render(<Feed load={load} />)
    expect(screen.queryByTestId('end')).toBeNull()
  })

  it('keeps loaded items after reaching the end', async () => {
    const { load, calls } = makeLoader()
    const user = userEvent.setup()
    render(<Feed load={load} />)
    await user.click(screen.getByTestId('load-more'))
    await settle(() => calls[0].resolve({ items: page([1, 2]), hasMore: false }))
    expect(screen.getAllByTestId(/^post-/)).toHaveLength(2)
    expect(screen.getByTestId('end')).toBeInTheDocument()
  })
})
