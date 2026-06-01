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

describe('URL Shortener', () => {
  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /url shortener/i })).toBeInTheDocument()
  })

  it('renders the Long URL input and Shorten button', () => {
    render(<App />)
    expect(screen.getByLabelText(/long url/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument()
  })

  it('does nothing when input is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /shorten/i }))
    expect(screen.queryByText(/short-1/)).not.toBeInTheDocument()
  })

  it('shows error for URL not starting with http:// or https://', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'ftp://not-valid.com')
    expect(screen.getByText('Invalid URL: must start with http:// or https://')).toBeInTheDocument()
  })

  it('does not add entry when URL is invalid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'ftp://not-valid.com')
    expect(screen.queryByText(/short-1/)).not.toBeInTheDocument()
  })

  it('clears error on successful submission', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'ftp://bad.com')
    expect(screen.getByText('Invalid URL: must start with http:// or https://')).toBeInTheDocument()
    await shorten(u, 'https://good.com')
    expect(screen.queryByText('Invalid URL: must start with http:// or https://')).not.toBeInTheDocument()
  })

  it('adds a valid http URL and shows short-1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'http://example.com/page')
    expect(screen.getByText('short-1')).toBeInTheDocument()
    expect(screen.getByText('http://example.com/page')).toBeInTheDocument()
  })

  it('adds a valid https URL and shows short-1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://example.com')
    expect(screen.getByText('short-1')).toBeInTheDocument()
  })

  it('clears the input after successful submission', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://example.com')
    expect(screen.getByLabelText(/long url/i)).toHaveValue('')
  })

  it('generates sequential short codes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://first.com')
    await shorten(u, 'https://second.com')
    await shorten(u, 'https://third.com')
    expect(screen.getByText('short-1')).toBeInTheDocument()
    expect(screen.getByText('short-2')).toBeInTheDocument()
    expect(screen.getByText('short-3')).toBeInTheDocument()
  })

  it('shows column headers: Short Link, Original URL, Clicks, Actions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://example.com')
    expect(screen.getByText('Short Link')).toBeInTheDocument()
    expect(screen.getByText('Original URL')).toBeInTheDocument()
    expect(screen.getByText('Clicks')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('starts each entry with 0 clicks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://example.com')
    const row = getRow('short-1')
    expect(within(row).getByText('0')).toBeInTheDocument()
  })

  it('increments clicks when Visit is clicked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://example.com')
    const row = getRow('short-1')
    await u.click(within(row).getByRole('button', { name: /visit/i }))
    expect(within(row).getByText('1')).toBeInTheDocument()
    await u.click(within(row).getByRole('button', { name: /visit/i }))
    expect(within(row).getByText('2')).toBeInTheDocument()
  })

  it('visiting one row does not affect another row clicks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://first.com')
    await shorten(u, 'https://second.com')
    const row1 = getRow('short-1')
    const row2 = getRow('short-2')
    await u.click(within(row1).getByRole('button', { name: /visit/i }))
    await u.click(within(row1).getByRole('button', { name: /visit/i }))
    expect(within(row1).getByText('2')).toBeInTheDocument()
    expect(within(row2).getByText('0')).toBeInTheDocument()
  })

  it('Copy button changes to Copied! after click', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://example.com')
    const row = getRow('short-1')
    const copyBtn = within(row).getByRole('button', { name: /^copy$/i })
    await u.click(copyBtn)
    expect(within(row).getByRole('button', { name: /copied!/i })).toBeInTheDocument()
  })

  it('copying one row does not change another row Copy button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await shorten(u, 'https://first.com')
    await shorten(u, 'https://second.com')
    const row1 = getRow('short-1')
    const row2 = getRow('short-2')
    await u.click(within(row1).getByRole('button', { name: /^copy$/i }))
    expect(within(row1).getByRole('button', { name: /copied!/i })).toBeInTheDocument()
    expect(within(row2).getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
  })

  it('whitespace-only input does nothing', async () => {
    const u = userEvent.setup()
    render(<App />)
    await typeUrl(u, '   ')
    await u.click(screen.getByRole('button', { name: /shorten/i }))
    expect(screen.queryByText(/short-1/)).not.toBeInTheDocument()
    expect(screen.queryByText('Invalid URL: must start with http:// or https://')).not.toBeInTheDocument()
  })
})
