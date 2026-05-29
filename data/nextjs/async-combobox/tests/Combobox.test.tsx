import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Combobox from '../components/Combobox'
import type { Option } from '../components/types'

type Resolve = (opts: Option[]) => void
type Reject = (e: unknown) => void

// Controllable fetcher: each call records its query and a resolve/reject handle.
function makeFetcher() {
  const calls: { query: string; resolve: Resolve; reject: Reject }[] = []
  const fetchOptions = (query: string) =>
    new Promise<Option[]>((resolve, reject) => {
      calls.push({ query, resolve, reject })
    })
  return { fetchOptions, calls }
}

const opts = (labels: string[]): Option[] =>
  labels.map((label) => ({ id: label.toLowerCase(), label }))

function type(value: string) {
  act(() => {
    fireEvent.change(screen.getByTestId('combo-input'), { target: { value } })
  })
}
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}
async function flush() {
  await act(async () => {
    await Promise.resolve()
    await Promise.resolve()
  })
}
function key(k: string) {
  act(() => {
    fireEvent.keyDown(screen.getByTestId('combo-input'), { key: k })
  })
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('Async combobox', () => {
  it('does not fetch until the debounce elapses', () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('ap')
    expect(calls).toHaveLength(0)
    advance(199)
    expect(calls).toHaveLength(0)
    advance(1)
    expect(calls).toHaveLength(1)
    expect(calls[0].query).toBe('ap')
  })

  it('shows a loading state while the fetch is in flight', async () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('ap')
    advance(200)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    await act(async () => {
      calls[0].resolve(opts(['Apple']))
    })
    expect(screen.queryByTestId('loading')).toBeNull()
  })

  it('renders resolved options in a listbox', async () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('ap')
    advance(200)
    await act(async () => calls[0].resolve(opts(['Apple', 'Apricot'])))
    expect(screen.getByTestId('listbox')).toBeInTheDocument()
    expect(screen.getByTestId('opt-apple')).toHaveTextContent('Apple')
    expect(screen.getByTestId('opt-apricot')).toBeInTheDocument()
  })

  it('coalesces rapid typing into a single fetch for the latest query', () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('a')
    advance(100)
    type('ap')
    advance(100)
    type('app')
    advance(200)
    expect(calls).toHaveLength(1)
    expect(calls[0].query).toBe('app')
  })

  it('ignores a stale (out-of-order) response, keeping the latest query result', async () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('a')
    advance(200) // fetch #0 for "a"
    type('ab')
    advance(200) // fetch #1 for "ab"
    expect(calls).toHaveLength(2)
    // resolve the LATEST first, then the stale one
    await act(async () => calls[1].resolve(opts(['Abby'])))
    await act(async () => calls[0].resolve(opts(['Alice', 'Andy'])))
    expect(screen.getByTestId('opt-abby')).toBeInTheDocument()
    expect(screen.queryByTestId('opt-alice')).toBeNull()
  })

  it('shows an empty state when the latest query returns nothing', async () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('zz')
    advance(200)
    await act(async () => calls[0].resolve([]))
    expect(screen.getByTestId('empty')).toBeInTheDocument()
    expect(screen.queryByTestId('listbox')).toBeNull()
  })

  it('shows an error state when the fetch rejects', async () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('ap')
    advance(200)
    await act(async () => calls[0].reject(new Error('network down')))
    expect(screen.getByTestId('error')).toHaveTextContent('network down')
    expect(screen.queryByTestId('listbox')).toBeNull()
  })

  it('clearing the input closes the option states without fetching', async () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('ap')
    advance(200)
    await act(async () => calls[0].resolve(opts(['Apple'])))
    expect(screen.getByTestId('opt-apple')).toBeInTheDocument()
    type('')
    advance(200)
    expect(calls).toHaveLength(1) // no new fetch for blank query
    expect(screen.queryByTestId('listbox')).toBeNull()
    expect(screen.queryByTestId('empty')).toBeNull()
  })

  it('ArrowDown/ArrowUp move the highlight with wrapping', async () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('a')
    advance(200)
    await act(async () => calls[0].resolve(opts(['Apple', 'Apricot'])))
    expect(screen.getByTestId('opt-apple')).toHaveAttribute('aria-selected', 'true')
    key('ArrowDown')
    expect(screen.getByTestId('opt-apricot')).toHaveAttribute('aria-selected', 'true')
    key('ArrowDown') // wrap to first
    expect(screen.getByTestId('opt-apple')).toHaveAttribute('aria-selected', 'true')
    key('ArrowUp') // wrap to last
    expect(screen.getByTestId('opt-apricot')).toHaveAttribute('aria-selected', 'true')
  })

  it('Enter selects the highlighted option, fills the input, and closes', async () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('a')
    advance(200)
    await act(async () => calls[0].resolve(opts(['Apple', 'Apricot'])))
    key('ArrowDown') // highlight Apricot
    key('Enter')
    expect((screen.getByTestId('combo-input') as HTMLInputElement).value).toBe('Apricot')
    expect(screen.queryByTestId('listbox')).toBeNull()
    advance(300)
    expect(calls).toHaveLength(1) // selecting does not schedule a fetch
  })

  it('clicking an option selects it and closes the list', async () => {
    const { fetchOptions, calls } = makeFetcher()
    render(<Combobox fetchOptions={fetchOptions} delay={200} />)
    type('a')
    advance(200)
    await act(async () => calls[0].resolve(opts(['Apple', 'Apricot'])))
    act(() => {
      fireEvent.click(screen.getByTestId('opt-apple'))
    })
    expect((screen.getByTestId('combo-input') as HTMLInputElement).value).toBe('Apple')
    expect(screen.queryByTestId('listbox')).toBeNull()
  })
})
