import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('routines, builder and stats', () => {
  it('lists each routine with kind, step count and streak', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-routines'))
    expect(screen.getByTestId('manage-r1-name')).toHaveTextContent('Morning')
    expect(screen.getByTestId('manage-r1-kind')).toHaveTextContent('morning')
    expect(screen.getByTestId('manage-r1-steps')).toHaveTextContent('3')
    // r1 history 05-26,05-27 -> not today, yesterday present => streak 2
    expect(screen.getByTestId('manage-r1-streak')).toHaveTextContent('2')
    expect(screen.getByTestId('manage-r2-streak')).toHaveTextContent('1')
  })

  it('deletes a routine from the manage list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-routines'))
    await user.click(screen.getByTestId('delete-r2'))
    expect(screen.queryByTestId('manage-r2')).not.toBeInTheDocument()
  })

  it('computes seed stats: total, completed today, longest streak', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-completed-value')).toHaveTextContent('0')
    expect(screen.getByTestId('stat-streak-value')).toHaveTextContent('2')
  })

  it('completing a routine today bumps its streak to 3', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-r1-s3'))
    await user.click(screen.getByTestId('nav-stats'))
    // r1 now completed today: 05-26,27,28 => streak 3
    expect(screen.getByTestId('stat-streak-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-completed-value')).toHaveTextContent('1')
  })

  it('blocks building a routine with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builder'))
    await user.click(screen.getByTestId('submit-routine'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-builder')).toBeInTheDocument()
  })

  it('builds an evening routine and navigates to routines', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builder'))
    await user.type(screen.getByTestId('name-input'), 'Wind down')
    await user.selectOptions(screen.getByTestId('kind-select'), 'evening')
    await user.click(screen.getByTestId('submit-routine'))
    expect(screen.getByTestId('page-routines')).toBeInTheDocument()
    expect(screen.getByTestId('manage-r3-name')).toHaveTextContent('Wind down')
    expect(screen.getByTestId('manage-r3-kind')).toHaveTextContent('evening')
    expect(screen.getByTestId('manage-r3-steps')).toHaveTextContent('0')
  })

  it('a freshly built routine has no streak and increases the total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builder'))
    await user.type(screen.getByTestId('name-input'), 'Wind down')
    await user.click(screen.getByTestId('submit-routine'))
    expect(screen.getByTestId('manage-r3-streak')).toHaveTextContent('0')
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('3')
  })

  it('deleting a routine lowers the total in stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-routines'))
    await user.click(screen.getByTestId('delete-r1'))
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('1')
    // only r2 remains with streak 1
    expect(screen.getByTestId('stat-streak-value')).toHaveTextContent('1')
  })
})
