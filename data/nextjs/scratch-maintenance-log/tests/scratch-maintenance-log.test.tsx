import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Maintenance Log', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /maintenance log/i })).toBeInTheDocument()
  })

  it('shows all 6 seed entries', () => {
    render(<App />)
    expect(screen.getAllByTestId('log-entry')).toHaveLength(6)
  })

  it('shows correct summary counts', () => {
    render(<App />)
    expect(screen.getByTestId('open-count').textContent).toBe('Open: 4')
    expect(screen.getByTestId('in-progress-count').textContent).toBe('In Progress: 1')
    expect(screen.getByTestId('completed-count').textContent).toBe('Completed: 1')
  })

  it('filters by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/status filter/i), 'Open')
    expect(screen.getAllByTestId('log-entry')).toHaveLength(4)
  })

  it('filters by priority', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/priority filter/i), 'High')
    expect(screen.getAllByTestId('log-entry')).toHaveLength(2)
  })

  it('combined status and priority filters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/status filter/i), 'Open')
    await user.selectOptions(screen.getByLabelText(/priority filter/i), 'Low')
    expect(screen.getAllByTestId('log-entry')).toHaveLength(2)
  })

  it('changes entry status via Change Status select', async () => {
    const user = userEvent.setup()
    render(<App />)
    const changeSelects = screen.getAllByLabelText(/change status/i)
    // First entry is Fix leaky faucet - Open
    await user.selectOptions(changeSelects[0], 'Completed')
    expect(screen.getByTestId('open-count').textContent).toBe('Open: 3')
    expect(screen.getByTestId('completed-count').textContent).toBe('Completed: 2')
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(screen.getAllByTestId('log-entry')).toHaveLength(5)
  })

  it('adds a new entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^title$/i), 'Fix roof')
    await user.type(screen.getByLabelText(/^area$/i), 'Exterior')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('log-entry')).toHaveLength(7)
    expect(screen.getByText('Fix roof')).toBeInTheDocument()
  })

  it('new entry starts with status Open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^title$/i), 'Fix roof')
    await user.type(screen.getByLabelText(/^area$/i), 'Exterior')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    const badges = screen.getAllByTestId('status-badge')
    expect(badges[badges.length - 1].textContent).toBe('Open')
  })

  it('does not add entry with empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^area$/i), 'Exterior')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('log-entry')).toHaveLength(6)
  })

  it('does not add entry with empty area', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^title$/i), 'Fix roof')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('log-entry')).toHaveLength(6)
  })

  it('summary counts unaffected by filters', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/status filter/i), 'Completed')
    expect(screen.getByTestId('open-count').textContent).toBe('Open: 4')
  })
})
