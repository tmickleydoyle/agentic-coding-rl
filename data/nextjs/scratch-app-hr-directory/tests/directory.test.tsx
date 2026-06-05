import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('directory search and filter', () => {
  it('lists all seeded employees', () => {
    render(<App />)
    const list = screen.getByTestId('employee-list')
    expect(within(list).getByText('Ada Lovelace')).toBeInTheDocument()
    expect(within(list).getByText('Grace Hopper')).toBeInTheDocument()
    expect(screen.getByTestId('result-count')).toHaveTextContent('5')
  })

  it('searches by name (case-insensitive)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('search-input'), 'grace')
    expect(screen.getByTestId('emp-e3')).toBeInTheDocument()
    expect(screen.queryByTestId('emp-e1')).not.toBeInTheDocument()
    expect(screen.getByTestId('result-count')).toHaveTextContent('1')
  })

  it('searches by title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('search-input'), 'Sales')
    expect(screen.getByTestId('emp-e4')).toBeInTheDocument()
    expect(screen.getByTestId('emp-e5')).toBeInTheDocument()
    expect(screen.queryByTestId('emp-e1')).not.toBeInTheDocument()
  })

  it('filters by department', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('dept-filter'), 'Engineering')
    expect(screen.getByTestId('emp-e2')).toBeInTheDocument()
    expect(screen.getByTestId('emp-e3')).toBeInTheDocument()
    expect(screen.queryByTestId('emp-e1')).not.toBeInTheDocument()
    expect(screen.getByTestId('result-count')).toHaveTextContent('2')
  })

  it('shows empty state when nothing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('search-input'), 'zzzzz')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('employee-list')).not.toBeInTheDocument()
  })
})
