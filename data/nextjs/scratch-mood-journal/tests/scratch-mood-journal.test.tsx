import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Mood Journal', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Mood Journal')).toBeInTheDocument()
  })

  it('shows 3 seed entries', () => {
    expect(screen.getAllByTestId('mood-entry')).toHaveLength(3)
  })

  it('shows entry count of 3', () => {
    expect(screen.getByTestId('entry-count').textContent).toBe('3 entries')
  })

  it('seed entries contain correct data', () => {
    const entries = screen.getAllByTestId('mood-entry')
    expect(entries[0].textContent).toContain('Happy')
    expect(entries[0].textContent).toContain('Had a great day at work')
  })

  it('adds a new mood entry', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Date$/i), '2024-03-04')
    await user.selectOptions(screen.getByLabelText(/^Mood$/i), 'Excited')
    await user.type(screen.getByLabelText(/note/i), 'Friday vibes')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('mood-entry')).toHaveLength(4)
  })

  it('updates entry count after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^Date$/i), '2024-03-04')
    await user.selectOptions(screen.getByLabelText(/^Mood$/i), 'Sad')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getByTestId('entry-count').textContent).toBe('4 entries')
  })

  it('does not add entry when date is missing', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/^Mood$/i), 'Angry')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('mood-entry')).toHaveLength(3)
  })

  it('filters entries by mood', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by mood/i), 'Happy')
    expect(screen.getAllByTestId('mood-entry')).toHaveLength(1)
    expect(screen.getAllByTestId('mood-entry')[0].textContent).toContain('Happy')
  })

  it('filter count reflects filtered results', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by mood/i), 'Calm')
    expect(screen.getByTestId('entry-count').textContent).toBe('1 entries')
  })

  it('all filter shows all entries', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by mood/i), 'Happy')
    await user.selectOptions(screen.getByLabelText(/filter by mood/i), 'All')
    expect(screen.getAllByTestId('mood-entry')).toHaveLength(3)
  })

  it('clears all entries', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryAllByTestId('mood-entry')).toHaveLength(0)
    expect(screen.getByTestId('entry-count').textContent).toBe('0 entries')
  })

  it('new entry visible when filter matches', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by mood/i), 'Excited')
    await user.type(screen.getByLabelText(/^Date$/i), '2024-03-05')
    await user.selectOptions(screen.getByLabelText(/^Mood$/i), 'Excited')
    await user.click(screen.getByRole('button', { name: /add entry/i }))
    expect(screen.getAllByTestId('mood-entry')).toHaveLength(1)
  })
})
