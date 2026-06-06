import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Unit Test Runner', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows 6 test rows', () => {
    expect(screen.getAllByTestId('test-row')).toHaveLength(6)
  })

  it('all statuses are pending initially', () => {
    const statuses = screen.getAllByTestId('test-status')
    statuses.forEach(s => expect(s).toHaveTextContent('pending'))
  })

  it('shows test names', () => {
    const names = screen.getAllByTestId('test-name')
    expect(names[0]).toHaveTextContent('adds two positive numbers')
    expect(names[5]).toHaveTextContent('always fails (intentional)')
  })

  it('shows Run All Tests button initially', () => {
    expect(screen.getByRole('button', { name: /run all tests/i })).toBeInTheDocument()
  })

  it('does not show Reset button initially', () => {
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument()
  })

  it('shows empty summary initially', () => {
    expect(screen.getByTestId('summary')).toHaveTextContent('')
  })

  it('updates statuses after running', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /run all tests/i }))
    const statuses = screen.getAllByTestId('test-status')
    expect(statuses[0]).toHaveTextContent('pass')
    expect(statuses[1]).toHaveTextContent('pass')
    expect(statuses[5]).toHaveTextContent('fail')
  })

  it('shows correct summary after running', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /run all tests/i }))
    expect(screen.getByTestId('summary')).toHaveTextContent('5 passed, 1 failed')
  })

  it('shows Reset button after running', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /run all tests/i }))
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('hides Run All Tests after running', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /run all tests/i }))
    expect(screen.queryByRole('button', { name: /run all tests/i })).not.toBeInTheDocument()
  })

  it('resets to initial state on Reset', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /run all tests/i }))
    await user.click(screen.getByRole('button', { name: /reset/i }))
    const statuses = screen.getAllByTestId('test-status')
    statuses.forEach(s => expect(s).toHaveTextContent('pending'))
    expect(screen.getByTestId('summary')).toHaveTextContent('')
    expect(screen.getByRole('button', { name: /run all tests/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument()
  })

  it('5 tests pass and 1 fails', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /run all tests/i }))
    const statuses = screen.getAllByTestId('test-status')
    const passes = statuses.filter(s => s.textContent === 'pass').length
    const fails = statuses.filter(s => s.textContent === 'fail').length
    expect(passes).toBe(5)
    expect(fails).toBe(1)
  })
})
