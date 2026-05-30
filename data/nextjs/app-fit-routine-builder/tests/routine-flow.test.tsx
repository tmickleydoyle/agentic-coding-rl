import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('routine flow', () => {
  it('lists seeded routines', () => {
    render(<App />)
    const list = screen.getByTestId('routine-list')
    expect(within(list).getByText('Upper Body')).toBeInTheDocument()
    expect(within(list).getByText('Lower Body')).toBeInTheDocument()
    expect(within(list).getByText('Core Blast')).toBeInTheDocument()
  })

  it('shows the exercise count for a routine', () => {
    render(<App />)
    expect(screen.getByTestId('routine-r1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('routine-r2-count')).toHaveTextContent('1')
  })

  it('shows the assigned day or unassigned', () => {
    render(<App />)
    expect(screen.getByTestId('routine-r1-day')).toHaveTextContent('mon')
    expect(screen.getByTestId('routine-r3-day')).toHaveTextContent('unassigned')
  })

  it('assigns a day to an unassigned routine', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('assign-r3'), 'fri')
    expect(screen.getByTestId('routine-r3-day')).toHaveTextContent('fri')
    expect(screen.getByTestId('routine-r3')).toHaveAttribute('data-day', 'fri')
  })

  it('unassigns a routine back to none', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('assign-r1'), 'none')
    expect(screen.getByTestId('routine-r1-day')).toHaveTextContent('unassigned')
    expect(screen.getByTestId('routine-r1')).toHaveAttribute('data-day', 'none')
  })

  it('removes a routine', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('routine-r2')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-r2'))
    expect(screen.queryByTestId('routine-r2')).not.toBeInTheDocument()
  })

  it('blocks saving a routine with an empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builder'))
    await user.click(screen.getByTestId('toggle-x1'))
    await user.click(screen.getByTestId('submit-routine'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-builder')).toBeInTheDocument()
  })

  it('blocks saving a routine with no exercises selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builder'))
    await user.type(screen.getByTestId('name-input'), 'Empty One')
    await user.click(screen.getByTestId('submit-routine'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('builds a routine and shows it on the routines page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builder'))
    await user.type(screen.getByTestId('name-input'), 'Full Body')
    await user.click(screen.getByTestId('toggle-x1'))
    await user.click(screen.getByTestId('toggle-x3'))
    expect(screen.getByTestId('selected-count')).toHaveTextContent('2')
    await user.click(screen.getByTestId('submit-routine'))
    expect(screen.getByTestId('page-routines')).toBeInTheDocument()
    expect(within(screen.getByTestId('routine-list')).getByText('Full Body')).toBeInTheDocument()
    expect(screen.getByTestId('routine-r4-count')).toHaveTextContent('2')
  })

  it('toggling an exercise twice deselects it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builder'))
    await user.click(screen.getByTestId('toggle-x1'))
    expect(screen.getByTestId('pick-x1')).toHaveAttribute('data-selected', 'true')
    await user.click(screen.getByTestId('toggle-x1'))
    expect(screen.getByTestId('pick-x1')).toHaveAttribute('data-selected', 'false')
    expect(screen.getByTestId('selected-count')).toHaveTextContent('0')
  })
})
