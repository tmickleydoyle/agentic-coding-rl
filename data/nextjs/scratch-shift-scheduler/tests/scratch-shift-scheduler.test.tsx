import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Shift Scheduler', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /shift scheduler/i })).toBeInTheDocument()
  })

  it('shows all days in table', () => {
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Friday')).toBeInTheDocument()
  })

  it('all slots start as Unassigned', () => {
    const cells = screen.getAllByText('Unassigned')
    expect(cells).toHaveLength(15) // 5 days * 3 shifts
  })

  it('assigns an employee to a shift', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/^day$/i), 'Monday')
    await user.selectOptions(screen.getByLabelText(/^shift$/i), 'Morning')
    await user.selectOptions(screen.getByLabelText(/^employee$/i), 'Alice Johnson')
    await user.click(screen.getByTestId('assign-button'))
    expect(screen.getByTestId('shift-cell-Monday-Morning')).toHaveTextContent('Alice Johnson')
  })

  it('replaces existing assignment', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/^day$/i), 'Tuesday')
    await user.selectOptions(screen.getByLabelText(/^shift$/i), 'Afternoon')
    await user.selectOptions(screen.getByLabelText(/^employee$/i), 'Bob Martinez')
    await user.click(screen.getByTestId('assign-button'))
    await user.selectOptions(screen.getByLabelText(/^employee$/i), 'Carol White')
    await user.click(screen.getByTestId('assign-button'))
    expect(screen.getByTestId('shift-cell-Tuesday-Afternoon')).toHaveTextContent('Carol White')
  })

  it('does not assign when no employee selected', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/^day$/i), 'Wednesday')
    await user.selectOptions(screen.getByLabelText(/^shift$/i), 'Night')
    // leave employee as blank
    await user.click(screen.getByTestId('assign-button'))
    expect(screen.getByTestId('shift-cell-Wednesday-Night')).toHaveTextContent('Unassigned')
  })

  it('shows employee summary after assignment', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/^employee$/i), 'David Lee')
    await user.click(screen.getByTestId('assign-button'))
    const rows = screen.getAllByTestId('summary-row')
    expect(rows).toHaveLength(1)
    expect(rows[0]).toHaveTextContent('David Lee')
  })

  it('summary counts multiple shifts for same employee', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/^employee$/i), 'Alice Johnson')
    await user.click(screen.getByTestId('assign-button'))
    await user.selectOptions(screen.getByLabelText(/^shift$/i), 'Afternoon')
    await user.click(screen.getByTestId('assign-button'))
    const rows = screen.getAllByTestId('summary-row')
    expect(rows[0]).toHaveTextContent('2')
  })

  it('clear all resets all slots to Unassigned', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/^employee$/i), 'Bob Martinez')
    await user.click(screen.getByTestId('assign-button'))
    await user.click(screen.getByTestId('clear-all'))
    const cells = screen.getAllByText('Unassigned')
    expect(cells).toHaveLength(15)
  })

  it('clear all hides summary', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/^employee$/i), 'Carol White')
    await user.click(screen.getByTestId('assign-button'))
    await user.click(screen.getByTestId('clear-all'))
    expect(screen.queryByTestId('summary-row')).not.toBeInTheDocument()
  })

  it('can assign different employees to different slots', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/^day$/i), 'Thursday')
    await user.selectOptions(screen.getByLabelText(/^shift$/i), 'Morning')
    await user.selectOptions(screen.getByLabelText(/^employee$/i), 'Alice Johnson')
    await user.click(screen.getByTestId('assign-button'))
    await user.selectOptions(screen.getByLabelText(/^day$/i), 'Friday')
    await user.selectOptions(screen.getByLabelText(/^shift$/i), 'Night')
    await user.selectOptions(screen.getByLabelText(/^employee$/i), 'Bob Martinez')
    await user.click(screen.getByTestId('assign-button'))
    expect(screen.getByTestId('shift-cell-Thursday-Morning')).toHaveTextContent('Alice Johnson')
    expect(screen.getByTestId('shift-cell-Friday-Night')).toHaveTextContent('Bob Martinez')
  })
})
