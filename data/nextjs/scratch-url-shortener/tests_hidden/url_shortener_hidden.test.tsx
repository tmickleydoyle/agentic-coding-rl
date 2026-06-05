// HELD-OUT generalization tests.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function typeUrl(u: ReturnType<typeof userEvent.setup>, url: string) {
  await u.clear(screen.getByLabelText(/long url/i))
  await u.type(screen.getByLabelText(/long url/i), url)
}

async function shorten(u: ReturnType<typeof userEvent.setup>, url: string) {
  await typeUrl(u, url)
  await u.click(screen.getByRole('button', { name: /shorten/i }))
}

function getRow(shortCode: string): HTMLElement {
  const cell = screen.getByText(shortCode)
  const row = cell.closest('tr')
  if (!row) throw new Error(`No row for ${shortCode}`)
  return row as HTMLElement
}

describe('URL Shortener (held-out)', () => {
  it('adds four entries with sequential codes short-1 through short-4', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://a.com')
    await shorten(u, 'https://b.com')
    await shorten(u, 'https://c.com')
    await shorten(u, 'https://d.com')
    expect(screen.getByText('short-4')).toBeInTheDocument()
    expect(screen.queryByText('short-5')).not.toBeInTheDocument()
  })

  it('invalid submission does not advance the short code counter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'ftp://bad.com')
    await shorten(u, 'https://good.com')
    expect(screen.getByText('short-1')).toBeInTheDocument()
    expect(screen.queryByText('short-2')).not.toBeInTheDocument()
  })

  it('each row independently tracks clicks up to many increments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://x.com')
    await shorten(u, 'https://y.com')
    const rowX = getRow('short-1')
    const rowY = getRow('short-2')
    for (let i = 0; i < 5; i++) {
      await u.click(within(rowX).getByRole('button', { name: /visit/i }))
    }
    for (let i = 0; i < 2; i++) {
      await u.click(within(rowY).getByRole('button', { name: /visit/i }))
    }
    expect(within(rowX).getByText('5')).toBeInTheDocument()
    expect(within(rowY).getByText('2')).toBeInTheDocument()
  })

  it('original URL is preserved in the row', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://my-very-specific-url.org/path?q=1')
    expect(screen.getByText('https://my-very-specific-url.org/path?q=1')).toBeInTheDocument()
  })

  it('error message disappears after a valid URL is submitted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'not-a-url-at-all')
    expect(screen.getByText('Invalid URL: must start with http:// or https://')).toBeInTheDocument()
    await shorten(u, 'http://valid.com')
    expect(screen.queryByText('Invalid URL: must start with http:// or https://')).not.toBeInTheDocument()
  })

  it('copy state is independent across three rows', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://one.com')
    await shorten(u, 'https://two.com')
    await shorten(u, 'https://three.com')
    const row2 = getRow('short-2')
    await u.click(within(row2).getByRole('button', { name: /^copy$/i }))
    expect(within(row2).getByRole('button', { name: /copied!/i })).toBeInTheDocument()
    const row1 = getRow('short-1')
    const row3 = getRow('short-3')
    expect(within(row1).getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
    expect(within(row3).getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
  })

  it('blank click then valid URL still uses short-1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /shorten/i }))
    await shorten(u, 'https://after-blank.com')
    expect(screen.getByText('short-1')).toBeInTheDocument()
  })

  it('input clears after each successful submission and stays empty before re-type', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://first.io')
    expect(screen.getByLabelText(/long url/i)).toHaveValue('')
    await shorten(u, 'https://second.io')
    expect(screen.getByLabelText(/long url/i)).toHaveValue('')
    expect(screen.getByText('short-2')).toBeInTheDocument()
  })
})
