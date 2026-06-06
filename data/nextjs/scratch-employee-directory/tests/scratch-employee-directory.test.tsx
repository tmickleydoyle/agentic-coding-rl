import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Employee Directory', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /employee directory/i })).toBeInTheDocument()
  })

  it('shows all 5 seed employees', () => {
    expect(screen.getAllByTestId('employee-card')).toHaveLength(5)
  })

  it('shows correct count for seed data', () => {
    expect(screen.getByTestId('employee-count')).toHaveTextContent('Showing 5 of 5 employees')
  })

  it('displays employee details', () => {
    const names = screen.getAllByTestId('employee-name').map(el => el.textContent)
    expect(names).toContain('Alice Johnson')
  })

  it('filters employees by search query matching name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search employees/i), 'alice')
    expect(screen.getAllByTestId('employee-card')).toHaveLength(1)
    expect(screen.getByTestId('employee-name')).toHaveTextContent('Alice Johnson')
  })

  it('filters employees by search query matching role', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search employees/i), 'manager')
    expect(screen.getAllByTestId('employee-card')).toHaveLength(1)
    expect(screen.getByTestId('employee-name')).toHaveTextContent('Bob Martinez')
  })

  it('filters employees by department', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by department/i), 'Engineering')
    expect(screen.getAllByTestId('employee-card')).toHaveLength(2)
    expect(screen.getByTestId('employee-count')).toHaveTextContent('Showing 2 of 5 employees')
  })

  it('applies search and department filter together', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by department/i), 'Engineering')
    await user.type(screen.getByLabelText(/search employees/i), 'alice')
    expect(screen.getAllByTestId('employee-card')).toHaveLength(1)
  })

  it('shows/hides add form when Add Employee clicked', async () => {
    const user = userEvent.setup()
    expect(screen.queryByTestId('add-form')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /add employee/i }))
    expect(screen.getByTestId('add-form')).toBeInTheDocument()
  })

  it('adds a new employee via the form', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add employee/i }))
    await user.type(screen.getByLabelText(/^name$/i), 'Frank Stone')
    await user.selectOptions(screen.getByLabelText(/^department$/i), 'HR')
    await user.type(screen.getByLabelText(/^role$/i), 'Recruiter')
    await user.type(screen.getByLabelText(/^email$/i), 'frank@company.com')
    await user.type(screen.getByLabelText(/^phone$/i), '555-0106')
    await user.click(screen.getByRole('button', { name: /save employee/i }))
    expect(screen.getAllByTestId('employee-card')).toHaveLength(6)
    expect(screen.getByTestId('employee-count')).toHaveTextContent('Showing 6 of 6 employees')
  })

  it('cancel hides the form without adding', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add employee/i }))
    await user.type(screen.getByLabelText(/^name$/i), 'Ghost')
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(screen.queryByTestId('add-form')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('employee-card')).toHaveLength(5)
  })

  it('does not add employee with empty fields', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add employee/i }))
    await user.click(screen.getByRole('button', { name: /save employee/i }))
    expect(screen.getByTestId('add-form')).toBeInTheDocument()
    expect(screen.getAllByTestId('employee-card')).toHaveLength(5)
  })

  it('search is case-insensitive', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/search employees/i), 'EVA')
    expect(screen.getAllByTestId('employee-card')).toHaveLength(1)
    expect(screen.getByTestId('employee-name')).toHaveTextContent('Eva Chen')
  })
})
