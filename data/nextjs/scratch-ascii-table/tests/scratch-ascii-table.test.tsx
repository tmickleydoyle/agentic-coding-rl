import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('ASCII Table', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /ascii table/i })).toBeInTheDocument()
  })

  it('shows all 95 characters initially', () => {
    expect(screen.getByTestId('result-count')).toHaveTextContent('Showing 95 characters')
  })

  it('renders all rows initially', () => {
    expect(screen.getAllByTestId('ascii-row')).toHaveLength(95)
  })

  it('shows dec value for A (65)', () => {
    expect(screen.getByTestId('dec-65')).toHaveTextContent('65')
  })

  it('shows hex value for A (65)', () => {
    expect(screen.getByTestId('hex-65')).toHaveTextContent('41')
  })

  it('shows char for A (65)', () => {
    expect(screen.getByTestId('char-65')).toHaveTextContent('A')
  })

  it('shows (space) for code 32', () => {
    expect(screen.getByTestId('char-32')).toHaveTextContent('(space)')
  })

  it('filters by decimal number', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search/i), '65')
    const rows = screen.getAllByTestId('ascii-row')
    expect(rows.length).toBeLessThan(95)
    expect(screen.getByTestId('dec-65')).toBeInTheDocument()
  })

  it('filters by description (case-insensitive)', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search/i), 'letter a')
    // matches "Letter A" (65) and "Letter a" (97)
    const rows = screen.getAllByTestId('ascii-row')
    expect(rows).toHaveLength(2)
  })

  it('updates result count after filtering', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search/i), 'digit')
    expect(screen.getByTestId('result-count')).toHaveTextContent('Showing 10 characters')
  })

  it('shows no rows when search has no match', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search/i), 'xyznothing')
    expect(screen.getByTestId('result-count')).toHaveTextContent('Showing 0 characters')
    expect(screen.queryAllByTestId('ascii-row')).toHaveLength(0)
  })

  it('clicking a row shows detail panel', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('dec-65'))
    expect(screen.getByTestId('detail-dec')).toHaveTextContent('65')
    expect(screen.getByTestId('detail-hex')).toHaveTextContent('41')
    expect(screen.getByTestId('detail-char')).toHaveTextContent('A')
    expect(screen.getByTestId('detail-desc')).toHaveTextContent('Letter A')
  })

  it('detail panel not shown initially', () => {
    expect(screen.queryByTestId('detail-dec')).not.toBeInTheDocument()
  })

  it('clicking a different row updates detail', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('dec-65'))
    await user.click(screen.getByTestId('dec-97'))
    expect(screen.getByTestId('detail-dec')).toHaveTextContent('97')
    expect(screen.getByTestId('detail-desc')).toHaveTextContent('Letter a')
  })

  it('clears filter restores all rows', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText(/search/i)
    await user.type(input, 'digit')
    await user.clear(input)
    expect(screen.getByTestId('result-count')).toHaveTextContent('Showing 95 characters')
  })
})
