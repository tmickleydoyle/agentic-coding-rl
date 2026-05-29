import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import SearchBox from '../components/SearchBox'
import { Fetcher } from '../hooks/useSearch'

// A controllable fetcher: every call returns a promise we can resolve by hand,
// so we can force responses to settle out of order.
function makeController() {
  const pending: { query: string; resolve: (v: string[]) => void }[] = []
  const fetcher: Fetcher = (query: string) =>
    new Promise<string[]>((resolve) => {
      pending.push({ query, resolve })
    })
  const resolveFor = async (query: string, results: string[]) => {
    const idx = pending.findIndex((p) => p.query === query)
    if (idx === -1) throw new Error(`no pending request for ${query}`)
    const [p] = pending.splice(idx, 1)
    await act(async () => {
      p.resolve(results)
      await Promise.resolve()
    })
  }
  return { fetcher, resolveFor, pending }
}

function shownResults(): string[] {
  const out: string[] = []
  for (let i = 0; i < 20; i++) {
    const el = screen.queryByTestId(`result-${i}`)
    if (!el) break
    out.push(el.textContent || '')
  }
  return out
}

describe('SearchBox / useSearch', () => {
  it('renders no results and not loading initially', () => {
    const { fetcher } = makeController()
    render(<SearchBox fetcher={fetcher} />)
    expect(screen.queryByTestId('result-0')).toBeNull()
    expect(screen.getByTestId('loading')).toHaveTextContent('')
  })

  it('shows loading while a request is in flight', () => {
    const { fetcher } = makeController()
    render(<SearchBox fetcher={fetcher} />)
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'a' } })
    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
  })

  it('displays the resolved results for a single query', async () => {
    const c = makeController()
    render(<SearchBox fetcher={c.fetcher} />)
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'a' } })
    await c.resolveFor('a', ['apple', 'apricot'])
    await waitFor(() => expect(shownResults()).toEqual(['apple', 'apricot']))
    expect(screen.getByTestId('loading')).toHaveTextContent('')
  })

  it('ignores a stale earlier response that resolves after a newer one (the bug)', async () => {
    const c = makeController()
    render(<SearchBox fetcher={c.fetcher} />)
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'a' } })
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'ab' } })
    // newer request resolves first
    await c.resolveFor('ab', ['ab-result'])
    // older, slower request resolves afterward — must NOT overwrite
    await c.resolveFor('a', ['a-result'])
    await waitFor(() => expect(shownResults()).toEqual(['ab-result']))
  })

  it('keeps loading false once the latest request has settled', async () => {
    const c = makeController()
    render(<SearchBox fetcher={c.fetcher} />)
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'a' } })
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'ab' } })
    await c.resolveFor('ab', ['ab-result'])
    expect(screen.getByTestId('loading')).toHaveTextContent('')
    // a late older response must not flip loading back on or change results
    await c.resolveFor('a', ['a-result'])
    expect(screen.getByTestId('loading')).toHaveTextContent('')
    expect(shownResults()).toEqual(['ab-result'])
  })

  it('applies the latest result when responses arrive in order', async () => {
    const c = makeController()
    render(<SearchBox fetcher={c.fetcher} />)
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'a' } })
    await c.resolveFor('a', ['a-result'])
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'ab' } })
    await c.resolveFor('ab', ['ab-result'])
    expect(shownResults()).toEqual(['ab-result'])
  })

  it('handles three rapid queries, showing only the last to be issued', async () => {
    const c = makeController()
    render(<SearchBox fetcher={c.fetcher} />)
    const input = screen.getByTestId('query')
    fireEvent.change(input, { target: { value: 'x' } })
    fireEvent.change(input, { target: { value: 'xy' } })
    fireEvent.change(input, { target: { value: 'xyz' } })
    // resolve middle, then last, then first — all out of order
    await c.resolveFor('xy', ['mid'])
    await c.resolveFor('xyz', ['final'])
    await c.resolveFor('x', ['first'])
    await waitFor(() => expect(shownResults()).toEqual(['final']))
  })

  it('updates results again for a brand-new query after settling', async () => {
    const c = makeController()
    render(<SearchBox fetcher={c.fetcher} />)
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'a' } })
    await c.resolveFor('a', ['a1'])
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'b' } })
    await c.resolveFor('b', ['b1', 'b2'])
    expect(shownResults()).toEqual(['b1', 'b2'])
  })
})
