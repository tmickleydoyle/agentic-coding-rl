import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('rsvp flow', () => {
  it('shows no-invite on invite-detail without a selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-invite-detail'))
    expect(screen.getByTestId('no-invite')).toBeInTheDocument()
  })

  it('opens an invite editor pre-filled with its current values', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    await user.click(screen.getByTestId('edit-i1'))
    expect(screen.getByTestId('invite-guest')).toHaveTextContent('Ada')
    expect(screen.getByTestId('status-select')).toHaveValue('yes')
    expect(screen.getByTestId('extra-input')).toHaveValue(2)
  })

  it('changing an RSVP to yes increases the headcount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    await user.click(screen.getByTestId('edit-i2')) // Grace: maybe -> yes
    await user.selectOptions(screen.getByTestId('status-select'), 'yes')
    await user.clear(screen.getByTestId('extra-input'))
    await user.type(screen.getByTestId('extra-input'), '1')
    await user.click(screen.getByTestId('submit-rsvp'))
    expect(screen.getByTestId('page-responses')).toBeInTheDocument()
    // 3 (Ada) + 2 (Grace 1+1) = 5
    expect(screen.getByTestId('event-headcount')).toHaveTextContent('5')
    expect(screen.getByTestId('tally-yes')).toHaveTextContent('2')
  })

  it('changing a yes to no drops the headcount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    await user.click(screen.getByTestId('edit-i1')) // Ada: yes -> no
    await user.selectOptions(screen.getByTestId('status-select'), 'no')
    await user.click(screen.getByTestId('submit-rsvp'))
    expect(screen.getByTestId('event-headcount')).toHaveTextContent('0')
  })

  it('updates the invite status shown in the responses list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-e1'))
    await user.click(screen.getByTestId('edit-i3')) // Linus: pending -> yes
    await user.selectOptions(screen.getByTestId('status-select'), 'yes')
    await user.click(screen.getByTestId('submit-rsvp'))
    expect(screen.getByTestId('invite-i3-status')).toHaveTextContent('yes')
  })
})

describe('create flow', () => {
  it('blocks creating an event with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.click(screen.getByTestId('submit-create'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
  })

  it('creates an event and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('name-input'), 'Hackathon')
    await user.type(screen.getByTestId('date-input'), '2026-11-01')
    await user.click(screen.getByTestId('submit-create'))
    expect(screen.getByTestId('page-events')).toBeInTheDocument()
    expect(screen.getByTestId('event-e3-name')).toHaveTextContent('Hackathon')
    expect(screen.getByTestId('event-e3-headcount')).toHaveTextContent('0')
  })
})
