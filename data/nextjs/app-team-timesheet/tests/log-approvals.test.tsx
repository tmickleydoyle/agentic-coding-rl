import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('log entry and approvals flow', () => {
  it('blocks logging with no hours', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log-entry'))
    await user.click(screen.getByTestId('submit-log'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-log-entry')).toBeInTheDocument()
  })

  it('blocks logging with zero hours', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log-entry'))
    await user.type(screen.getByTestId('hours-input'), '0')
    await user.click(screen.getByTestId('submit-log'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('logs hours and shows them on the week grid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log-entry'))
    await user.selectOptions(screen.getByTestId('project-select'), 'p3')
    await user.selectOptions(screen.getByTestId('day-select'), 'wed')
    await user.type(screen.getByTestId('hours-input'), '6')
    await user.click(screen.getByTestId('submit-log'))
    expect(screen.getByTestId('page-week')).toBeInTheDocument()
    expect(screen.getByTestId('day-wed-total')).toHaveTextContent('6')
    expect(screen.getByTestId('week-total')).toHaveTextContent('18')
    const wed = screen.getByTestId('day-wed')
    expect(within(wed).getByText('Carol')).toBeInTheDocument()
  })

  it('a logged entry updates the project total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log-entry'))
    await user.selectOptions(screen.getByTestId('project-select'), 'p1')
    await user.type(screen.getByTestId('hours-input'), '2')
    await user.click(screen.getByTestId('submit-log'))
    await user.click(screen.getByTestId('nav-projects'))
    expect(screen.getByTestId('project-p1-total')).toHaveTextContent('9')
  })

  it('shows submitted and pending counts on approvals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-approvals'))
    expect(screen.getByTestId('submitted-count')).toHaveTextContent('1')
    expect(screen.getByTestId('pending-count')).toHaveTextContent('2')
  })

  it('submits a single entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-approvals'))
    expect(screen.getByTestId('approval-h1')).toHaveAttribute('data-submitted', 'false')
    await user.click(screen.getByTestId('submit-h1'))
    expect(screen.getByTestId('approval-h1')).toHaveAttribute('data-submitted', 'true')
    expect(screen.getByTestId('submitted-count')).toHaveTextContent('2')
    expect(screen.queryByTestId('submit-h1')).not.toBeInTheDocument()
  })

  it('submits all entries', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-approvals'))
    await user.click(screen.getByTestId('submit-all'))
    expect(screen.getByTestId('submitted-count')).toHaveTextContent('3')
    expect(screen.getByTestId('pending-count')).toHaveTextContent('0')
    expect(screen.queryByTestId('submit-h2')).not.toBeInTheDocument()
  })

  it('keeps theme on app-root across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-approvals'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
