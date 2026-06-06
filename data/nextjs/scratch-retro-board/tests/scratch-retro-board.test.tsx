import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Retro Board', () => {
  beforeEach(() => render(<App />))

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /retro board/i })).toBeInTheDocument()
  })

  it('renders three category columns', () => {
    expect(screen.getByTestId('col-went-well')).toBeInTheDocument()
    expect(screen.getByTestId('col-needs-improvement')).toBeInTheDocument()
    expect(screen.getByTestId('col-action-items')).toBeInTheDocument()
  })

  it('shows 6 note cards total', () => {
    expect(screen.getAllByTestId('note-card')).toHaveLength(6)
  })

  it('shows correct count for Went Well (2)', () => {
    expect(screen.getByTestId('count-went-well').textContent).toBe('2')
  })

  it('shows correct count for Needs Improvement (2)', () => {
    expect(screen.getByTestId('count-needs-improvement').textContent).toBe('2')
  })

  it('shows correct count for Action Items (2)', () => {
    expect(screen.getByTestId('count-action-items').textContent).toBe('2')
  })

  it('shows initial votes as 0', () => {
    const votes = screen.getAllByTestId('note-votes')
    votes.forEach(v => expect(v.textContent).toBe('0'))
  })

  it('increments vote count on upvote', async () => {
    const user = userEvent.setup()
    const upvoteButtons = screen.getAllByRole('button', { name: /upvote/i })
    await user.click(upvoteButtons[0])
    const votes = screen.getAllByTestId('note-votes')
    expect(votes[0].textContent).toBe('1')
  })

  it('upvote only affects clicked note', async () => {
    const user = userEvent.setup()
    const upvoteButtons = screen.getAllByRole('button', { name: /upvote/i })
    await user.click(upvoteButtons[0])
    const votes = screen.getAllByTestId('note-votes')
    expect(votes[1].textContent).toBe('0')
  })

  it('deletes a note', async () => {
    const user = userEvent.setup()
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('note-card')).toHaveLength(5)
  })

  it('adds a note to Went Well', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/note text/i), 'Good vibes')
    await user.selectOptions(screen.getByLabelText(/^category$/i), 'Went Well')
    await user.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getByTestId('count-went-well').textContent).toBe('3')
    expect(screen.getByText('Good vibes')).toBeInTheDocument()
  })

  it('adds a note to Action Items', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/note text/i), 'Fix CI pipeline')
    await user.selectOptions(screen.getByLabelText(/^category$/i), 'Action Items')
    await user.click(screen.getByRole('button', { name: /add note/i }))
    const actionCol = screen.getByTestId('col-action-items')
    expect(within(actionCol).getByText('Fix CI pipeline')).toBeInTheDocument()
  })

  it('clears textarea after adding note', async () => {
    const user = userEvent.setup()
    const textarea = screen.getByLabelText(/note text/i)
    await user.type(textarea, 'Temp note')
    await user.click(screen.getByRole('button', { name: /add note/i }))
    expect(textarea).toHaveValue('')
  })

  it('does not add note with empty text', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add note/i }))
    expect(screen.getAllByTestId('note-card')).toHaveLength(6)
  })
})
