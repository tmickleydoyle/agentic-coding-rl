import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('CSV Viewer', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock')
    global.URL.revokeObjectURL = vi.fn()
    render(<App />)
  })

  it('auto-parses seed data on render', () => {
    expect(screen.getByTestId('status')).toHaveTextContent('5 rows, 4 columns')
  })

  it('renders 4 column headers from seed', () => {
    const headers = screen.getAllByTestId('col-header')
    expect(headers).toHaveLength(4)
    expect(headers[0].textContent).toContain('Name')
  })

  it('renders 5 data rows from seed', () => {
    expect(screen.getAllByTestId('row')).toHaveLength(5)
  })

  it('renders cells for all rows', () => {
    // 5 rows * 4 cols = 20 cells
    expect(screen.getAllByTestId('cell')).toHaveLength(20)
  })

  it('search filters rows case-insensitively', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Search'), 'alice')
    expect(screen.getAllByTestId('row')).toHaveLength(1)
    expect(screen.getAllByTestId('cell')[0]).toHaveTextContent('Alice')
  })

  it('search with no matches shows no rows', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Search'), 'zzznomatch')
    expect(screen.queryAllByTestId('row')).toHaveLength(0)
  })

  it('clicking column header sorts ascending', async () => {
    const user = userEvent.setup()
    const headers = screen.getAllByTestId('col-header')
    await user.click(headers[0]) // Sort by Name
    expect(screen.getByTestId('sort-indicator')).toHaveTextContent('▲')
    const rows = screen.getAllByTestId('row')
    expect(rows[0].textContent).toContain('Alice')
  })

  it('clicking same column header again sorts descending', async () => {
    const user = userEvent.setup()
    const headers = screen.getAllByTestId('col-header')
    await user.click(headers[0])
    await user.click(headers[0])
    expect(screen.getByTestId('sort-indicator')).toHaveTextContent('▼')
    const rows = screen.getAllByTestId('row')
    expect(rows[0].textContent).toContain('Eve')
  })

  it('clicking different column header changes sort column', async () => {
    const user = userEvent.setup()
    const headers = screen.getAllByTestId('col-header')
    await user.click(headers[0]) // Name asc
    await user.click(headers[1]) // Age asc
    const indicators = screen.getAllByTestId('sort-indicator')
    expect(indicators).toHaveLength(1)
  })

  it('Parse button re-parses textarea content', async () => {
    const user = userEvent.setup()
    const textarea = screen.getByLabelText('CSV Input')
    await user.clear(textarea)
    await user.type(textarea, 'A,B\n1,2\n3,4')
    await user.click(screen.getByRole('button', { name: 'Parse' }))
    expect(screen.getByTestId('status')).toHaveTextContent('2 rows, 2 columns')
  })

  it('Parse with empty textarea shows No data', async () => {
    const user = userEvent.setup()
    const textarea = screen.getByLabelText('CSV Input')
    await user.clear(textarea)
    await user.click(screen.getByRole('button', { name: 'Parse' }))
    expect(screen.getByTestId('status')).toHaveTextContent('No data')
  })

  it('Parse resets sort state', async () => {
    const user = userEvent.setup()
    const headers = screen.getAllByTestId('col-header')
    await user.click(headers[0])
    expect(screen.getByTestId('sort-indicator')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Parse' }))
    expect(screen.queryByTestId('sort-indicator')).not.toBeInTheDocument()
  })
})
