import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add ticker flow', () => {
  it('blocks submitting with a blank symbol', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('price-input'), '100')
    await user.type(screen.getByTestId('target-input'), '90')
    await user.click(screen.getByTestId('submit-ticker'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks submitting with a non-positive target', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'AMD')
    await user.type(screen.getByTestId('price-input'), '100')
    await user.type(screen.getByTestId('target-input'), '0')
    await user.click(screen.getByTestId('submit-ticker'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a below-target ticker that immediately hits', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('symbol-input'), 'amd')
    await user.type(screen.getByTestId('price-input'), '90')
    await user.type(screen.getByTestId('target-input'), '120')
    await user.selectOptions(screen.getByTestId('direction-input'), 'below')
    await user.click(screen.getByTestId('submit-ticker'))
    expect(screen.getByTestId('page-watchlist')).toBeInTheDocument()
    expect(within(screen.getByTestId('ticker-list')).getByText('AMD')).toBeInTheDocument()
    // 90 <= 120 below => hit; alert count 2 + 1 = 3
    expect(screen.getByTestId('ticker-t5')).toHaveAttribute('data-alert', 'true')
    expect(screen.getByTestId('stat-alerts-value')).toHaveTextContent('3')
  })
})

import { GET, POST, DELETE, __reset } from '../app/api/watchlist/route'

const req = (url: string, init?: RequestInit) => new Request(url, init)

describe('watchlist API', () => {
  beforeEach(() => __reset())

  it('GET lists the seeded tickers', async () => {
    const res = await GET(req('http://x/api/watchlist'))
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('application/json')
    const body = await res.json()
    expect(body.tickers.map((t: { id: string }) => t.id)).toEqual(['t1', 't2', 't3', 't4'])
  })

  it('GET ?alerts=true returns only hit tickers', async () => {
    const res = await GET(req('http://x/api/watchlist?alerts=true'))
    const body = await res.json()
    expect(body.tickers.map((t: { id: string }) => t.id)).toEqual(['t1', 't3'])
  })

  it('POST creates a ticker and returns 201', async () => {
    const res = await POST(
      req('http://x/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ symbol: 'amd', price: 90, targetPrice: 120, direction: 'below' }),
      }),
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.symbol).toBe('AMD')
    expect(body.direction).toBe('below')
    expect(body.id).toBe('t5')
  })

  it('POST defaults direction to above when omitted', async () => {
    const res = await POST(
      req('http://x/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ symbol: 'AMD', price: 50, targetPrice: 40 }),
      }),
    )
    const body = await res.json()
    expect(body.direction).toBe('above')
  })

  it('POST without a symbol returns 400', async () => {
    const res = await POST(
      req('http://x/api/watchlist', { method: 'POST', body: JSON.stringify({ price: 10, targetPrice: 5 }) }),
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'symbol required' })
  })

  it('POST with a non-positive targetPrice returns 400', async () => {
    const res = await POST(
      req('http://x/api/watchlist', {
        method: 'POST',
        body: JSON.stringify({ symbol: 'AMD', price: 10, targetPrice: 0 }),
      }),
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'targetPrice must be positive' })
  })

  it('DELETE removes a ticker', async () => {
    const del = await DELETE(req('http://x/api/watchlist?id=t1', { method: 'DELETE' }))
    expect(del.status).toBe(200)
    expect(await del.json()).toEqual({ ok: true })
    const res = await GET(req('http://x/api/watchlist'))
    const body = await res.json()
    expect(body.tickers.map((t: { id: string }) => t.id)).toEqual(['t2', 't3', 't4'])
  })

  it('DELETE on a missing id returns 404', async () => {
    const res = await DELETE(req('http://x/api/watchlist?id=nope', { method: 'DELETE' }))
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'not found' })
  })
})
