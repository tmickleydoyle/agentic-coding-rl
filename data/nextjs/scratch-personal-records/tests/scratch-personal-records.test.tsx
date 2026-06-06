import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Personal Records', () => {
  it('shows 4 seed records', () => {
    render(<App />)
    expect(screen.getAllByTestId('record-row')).toHaveLength(4)
  })

  it('shows seed exercise names', () => {
    render(<App />)
    const names = screen.getAllByTestId('record-exercise').map(el => el.textContent)
    expect(names).toContain('Bench Press')
    expect(names).toContain('Squat')
    expect(names).toContain('Deadlift')
    expect(names).toContain('Overhead Press')
  })

  it('shows correct record count', () => {
    render(<App />)
    expect(screen.getByTestId('record-count').textContent).toBe('Records: 4')
  })

  it('shows heaviest lift from seed data', () => {
    render(<App />)
    expect(screen.getByTestId('heaviest-lift').textContent).toBe('Heaviest: 275 lbs')
  })

  it('shows latest date from seed data', () => {
    render(<App />)
    expect(screen.getByTestId('latest-date').textContent).toBe('Latest: 2024-03-10')
  })

  it('save button is disabled when exercise is empty', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /save record/i })).toBeDisabled()
  })

  it('adds a new record', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^exercise$/i), 'Clean and Jerk')
    await user.clear(screen.getByLabelText(/^weight$/i))
    await user.type(screen.getByLabelText(/^weight$/i), '135')
    await user.click(screen.getByRole('button', { name: /save record/i }))
    expect(screen.getAllByTestId('record-row')).toHaveLength(5)
    const names = screen.getAllByTestId('record-exercise').map(el => el.textContent)
    expect(names).toContain('Clean and Jerk')
  })

  it('clears exercise input after saving', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/^exercise$/i), 'Row')
    await user.clear(screen.getByLabelText(/^weight$/i))
    await user.type(screen.getByLabelText(/^weight$/i), '100')
    await user.click(screen.getByRole('button', { name: /save record/i }))
    expect(screen.getByLabelText(/^exercise$/i)).toHaveValue('')
  })

  it('deletes a record', async () => {
    const user = userEvent.setup()
    render(<App />)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('record-row')).toHaveLength(3)
  })

  it('shows empty message when all records deleted', async () => {
    const user = userEvent.setup()
    render(<App />)
    const getDeletes = () => screen.queryAllByRole('button', { name: /delete/i })
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    expect(screen.getByTestId('empty-message')).toBeInTheDocument()
  })

  it('shows heaviest as dash when no records', async () => {
    const user = userEvent.setup()
    render(<App />)
    const getDeletes = () => screen.queryAllByRole('button', { name: /delete/i })
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    await user.click(getDeletes()[0])
    expect(screen.getByTestId('heaviest-lift').textContent).toBe('Heaviest: —')
  })

  it('records are sorted by date descending', () => {
    render(<App />)
    const dates = screen.getAllByTestId('record-date').map(el => el.textContent)
    expect(dates[0]).toBe('2024-03-10')
  })

  it('updates record count stat after delete', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0])
    expect(screen.getByTestId('record-count').textContent).toBe('Records: 3')
  })
})
