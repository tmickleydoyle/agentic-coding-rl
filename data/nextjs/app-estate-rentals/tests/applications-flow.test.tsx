import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('applications flow', () => {
  it('lists all applications with applicant, unit label and status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-applications'))
    expect(screen.getByTestId('application-a1-applicant')).toHaveTextContent('Ada')
    expect(screen.getByTestId('application-a1-unit')).toHaveTextContent('A2')
    expect(screen.getByTestId('application-a1-status')).toHaveTextContent('pending')
    expect(screen.getByTestId('application-a2')).toHaveAttribute('data-status', 'rejected')
  })

  it('changes an application status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-applications'))
    await user.click(screen.getByTestId('reject-a1'))
    expect(screen.getByTestId('application-a1')).toHaveAttribute('data-status', 'rejected')
    await user.click(screen.getByTestId('pending-a1'))
    expect(screen.getByTestId('application-a1')).toHaveAttribute('data-status', 'pending')
  })

  it('approving an application marks its unit occupied', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-applications'))
    await user.click(screen.getByTestId('approve-a3')) // a3 is for u3 (vacant)
    expect(screen.getByTestId('application-a3')).toHaveAttribute('data-status', 'approved')
    await user.click(screen.getByTestId('nav-units'))
    expect(screen.getByTestId('unit-u3')).toHaveAttribute('data-occupied', 'true')
  })

  it('approving raises the occupancy rate', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-applications'))
    await user.click(screen.getByTestId('approve-a3'))
    await user.click(screen.getByTestId('nav-occupancy'))
    // u1 + u3 occupied of 3 => 67%
    expect(screen.getByTestId('occupancy-rate')).toHaveTextContent('67%')
  })

  it('the pending count drops after resolving a pending application', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-applications'))
    await user.click(screen.getByTestId('approve-a1'))
    await user.click(screen.getByTestId('nav-occupancy'))
    // started with 2 pending (a1, a3); approved a1 => 1 pending left
    expect(screen.getByTestId('pending-count')).toHaveTextContent('1')
  })

  it('a new application from the detail appears in the applications list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-u1'))
    await user.type(screen.getByTestId('applicant-input'), 'Nora')
    await user.click(screen.getByTestId('submit-application'))
    await user.click(screen.getByTestId('nav-applications'))
    expect(screen.getByTestId('application-a4-applicant')).toHaveTextContent('Nora')
    expect(screen.getByTestId('application-a4-unit')).toHaveTextContent('A1')
  })
})
