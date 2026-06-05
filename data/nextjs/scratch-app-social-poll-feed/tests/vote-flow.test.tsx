import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('vote flow', () => {
  it('shows option labels, votes and percentages on the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q1'))
    expect(screen.getByTestId('option-q1-o1-label')).toHaveTextContent('Rust')
    expect(screen.getByTestId('option-q1-o1-votes')).toHaveTextContent('5')
    // total 15: Rust 33, Go 20, TS 47
    expect(screen.getByTestId('option-q1-o1-pct')).toHaveTextContent('33')
    expect(screen.getByTestId('option-q1-o2-pct')).toHaveTextContent('20')
    expect(screen.getByTestId('option-q1-o3-pct')).toHaveTextContent('47')
  })

  it('casts a vote and increments the option count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q1'))
    await user.click(screen.getByTestId('vote-q1-o2'))
    expect(screen.getByTestId('option-q1-o2-votes')).toHaveTextContent('4') // 3 -> 4
  })

  it('disables voting after a vote and shows the already-voted message', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q1'))
    await user.click(screen.getByTestId('vote-q1-o1'))
    expect(screen.getByTestId('already-voted')).toBeInTheDocument()
    expect(screen.getByTestId('vote-q1-o1')).toBeDisabled()
    expect(screen.getByTestId('vote-q1-o2')).toBeDisabled()
  })

  it('does not allow a second vote to change the counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q1'))
    await user.click(screen.getByTestId('vote-q1-o1'))
    expect(screen.getByTestId('option-q1-o1-votes')).toHaveTextContent('6')
    // button disabled; userEvent click on a disabled button is a no-op
    await user.click(screen.getByTestId('vote-q1-o2'))
    expect(screen.getByTestId('option-q1-o2-votes')).toHaveTextContent('3')
  })

  it('shows the already-voted state for a poll that was pre-voted in the seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q2'))
    expect(screen.getByTestId('already-voted')).toBeInTheDocument()
    expect(screen.getByTestId('vote-q2-o1')).toBeDisabled()
  })

  it('shows a no-poll message when navigating to poll without a selection', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-poll'))
    expect(screen.getByTestId('no-poll-selected')).toBeInTheDocument()
  })

  it('reflects a cast vote on the polls list total and indicator', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-q3'))
    await user.click(screen.getByTestId('vote-q3-o1'))
    await user.click(screen.getByTestId('nav-polls'))
    expect(screen.getByTestId('poll-q3-total')).toHaveTextContent('9') // 8 -> 9
    expect(screen.getByTestId('poll-q3-voted')).toHaveTextContent('Voted')
  })
})
