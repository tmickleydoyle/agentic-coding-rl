import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('week plan', () => {
  it("shows today's session (mon) with the routine assigned to monday", async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-week-plan'))
    expect(screen.getByTestId('today-session')).toHaveAttribute('data-today', 'mon')
    expect(screen.getByTestId('today-count')).toHaveTextContent('1')
    expect(within(screen.getByTestId('today-routines')).getByText('Upper Body')).toBeInTheDocument()
  })

  it('groups routines under their assigned weekday', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-week-plan'))
    expect(screen.getByTestId('day-mon-count')).toHaveTextContent('1')
    expect(screen.getByTestId('day-wed-count')).toHaveTextContent('1')
    expect(screen.getByTestId('day-fri-count')).toHaveTextContent('0')
    expect(screen.getByTestId('day-mon-routine-r1')).toBeInTheDocument()
    expect(screen.getByTestId('day-wed-routine-r2')).toBeInTheDocument()
  })

  it('does not show the unassigned routine in any day', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-week-plan'))
    expect(screen.queryByTestId('day-mon-routine-r3')).not.toBeInTheDocument()
    expect(screen.queryByTestId('day-tue-routine-r3')).not.toBeInTheDocument()
  })

  it('reflects a newly assigned day in the week plan', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('assign-r3'), 'mon')
    await user.click(screen.getByTestId('nav-week-plan'))
    expect(screen.getByTestId('today-count')).toHaveTextContent('2')
    expect(screen.getByTestId('day-mon-routine-r3')).toBeInTheDocument()
  })

  it('lists the exercise library', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-library'))
    expect(screen.getByTestId('library-x1-name')).toHaveTextContent('Push Up')
    expect(screen.getByTestId('library-x4-muscle')).toHaveTextContent('Core')
  })
})
