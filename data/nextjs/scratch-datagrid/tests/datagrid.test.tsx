import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

function dataRows(): HTMLElement[] {
  // getAllByRole('row') includes the header row first.
  return screen.getAllByRole('row').slice(1)
}
function firstDataRow(): HTMLElement {
  return dataRows()[0]
}
async function clickHeader(u: U, name: RegExp) {
  await u.click(screen.getByRole('button', { name }))
}

describe('Data table', () => {
  it('renders the first page of 5 rows with a page indicator', () => {
    render(<App />)
    expect(dataRows()).toHaveLength(5)
    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument()
    expect(within(firstDataRow()).getByText('Alice')).toBeInTheDocument()
  })

  it('disables Previous on the first page', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
  })

  it('pages forward to page 2', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument()
    expect(within(firstDataRow()).getByText('Frank')).toBeInTheDocument()
  })

  it('reaches the last page, which has 2 rows, and disables Next', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /next/i }))
    await u.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/page 3 of 3/i)).toBeInTheDocument()
    expect(dataRows()).toHaveLength(2)
    expect(within(firstDataRow()).getByText('Mallory')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
  })

  it('pages back with Previous', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /next/i }))
    await u.click(screen.getByRole('button', { name: /previous/i }))
    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument()
  })

  it('filters by name (case-insensitive) and collapses to one page', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/search/i), 'ali')
    expect(dataRows()).toHaveLength(1)
    expect(within(firstDataRow()).getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText(/page 1 of 1/i)).toBeInTheDocument()
  })

  it('resets to page 1 when searching from a later page', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText(/page 2 of 3/i)).toBeInTheDocument()
    await u.type(screen.getByLabelText(/search/i), 'a')
    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument()
  })

  it('restores all rows when the search is cleared', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/search/i), 'ali')
    expect(dataRows()).toHaveLength(1)
    await u.clear(screen.getByLabelText(/search/i))
    expect(dataRows()).toHaveLength(5)
    expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument()
  })

  it('sorts by Age ascending (youngest first)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await clickHeader(u, /age/i)
    expect(within(firstDataRow()).getByText('Frank')).toBeInTheDocument()
    expect(within(firstDataRow()).getByText('22')).toBeInTheDocument()
  })

  it('toggles to Age descending (oldest first) on a second click', async () => {
    const u = userEvent.setup()
    render(<App />)
    await clickHeader(u, /age/i)
    await clickHeader(u, /age/i)
    expect(within(firstDataRow()).getByText('Mallory')).toBeInTheDocument()
    expect(within(firstDataRow()).getByText('45')).toBeInTheDocument()
  })

  it('sorts by Name descending on a second click', async () => {
    const u = userEvent.setup()
    render(<App />)
    await clickHeader(u, /name/i)
    await clickHeader(u, /name/i)
    expect(within(firstDataRow()).getByText('Niaj')).toBeInTheDocument()
  })

  it('counts selected rows and supports deselecting', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByText(/selected: 0/i)).toBeInTheDocument()
    await u.click(screen.getByLabelText(/select alice/i))
    await u.click(screen.getByLabelText(/select bob/i))
    expect(screen.getByText(/selected: 2/i)).toBeInTheDocument()
    await u.click(screen.getByLabelText(/select alice/i))
    expect(screen.getByText(/selected: 1/i)).toBeInTheDocument()
  })
})
