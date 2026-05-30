import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('requests list and decisions', () => {
  it('lists seeded requests with employee names and status', () => {
    render(<App />)
    expect(screen.getByTestId('request-r1-employee')).toHaveTextContent('Ada')
    expect(screen.getByTestId('request-r1-status')).toHaveTextContent('approved')
    expect(screen.getByTestId('request-r3-employee')).toHaveTextContent('Grace')
    expect(screen.getByTestId('request-r2-days')).toHaveTextContent('2')
  })

  it('approve and reject are disabled on already-decided requests', () => {
    render(<App />)
    expect(screen.getByTestId('approve-r1')).toBeDisabled()
    expect(screen.getByTestId('reject-r1')).toBeDisabled()
    expect(screen.getByTestId('approve-r4')).toBeDisabled()
    expect(screen.getByTestId('approve-r2')).not.toBeDisabled()
  })

  it('approves a pending request', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('approve-r2'))
    expect(screen.getByTestId('request-r2-status')).toHaveTextContent('approved')
    expect(screen.getByTestId('request-r2')).toHaveAttribute('data-status', 'approved')
    expect(screen.getByTestId('approve-r2')).toBeDisabled()
  })

  it('rejects a pending request', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('reject-r3'))
    expect(screen.getByTestId('request-r3-status')).toHaveTextContent('rejected')
    expect(screen.getByTestId('request-r3')).toHaveAttribute('data-status', 'rejected')
  })

  it('opens a request detail and shows the reason', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r2'))
    expect(screen.getByTestId('page-request-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-employee')).toHaveTextContent('Ada')
    expect(screen.getByTestId('detail-reason')).toHaveTextContent('Family')
    expect(screen.getByTestId('nav-request-detail')).toHaveAttribute('aria-current', 'page')
  })

  it('approves from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-r3'))
    await user.click(screen.getByTestId('detail-approve'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('approved')
    expect(screen.getByTestId('detail-approve')).toBeDisabled()
  })
})
