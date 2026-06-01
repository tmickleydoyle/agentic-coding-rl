import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('leads list, filter, detail', () => {
  it('lists seeded leads with score and status', () => {
    render(<App />)
    expect(screen.getByTestId('lead-l1-name')).toHaveTextContent('Ada Byron')
    expect(screen.getByTestId('lead-l1-score')).toHaveTextContent('80')
    expect(screen.getByTestId('lead-l2-status')).toHaveTextContent('qualified')
    expect(screen.getByTestId('lead-l1')).toHaveAttribute('data-status', 'new')
  })

  it('filters leads by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('status-filter'), 'new')
    const list = screen.getByTestId('lead-list')
    expect(within(list).getByTestId('lead-l1')).toBeInTheDocument()
    expect(within(list).getByTestId('lead-l3')).toBeInTheDocument()
    expect(within(list).queryByTestId('lead-l2')).not.toBeInTheDocument()
    expect(within(list).queryByTestId('lead-l4')).not.toBeInTheDocument()
  })

  it('shows an empty state when no lead matches the filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('status-filter'), 'lost')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('lead-list')).not.toBeInTheDocument()
  })

  it('opens a lead detail when clicking open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l1'))
    expect(screen.getByTestId('page-lead-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Ada Byron')
    expect(screen.getByTestId('detail-source')).toHaveTextContent('web')
    expect(screen.getByTestId('nav-lead-detail')).toHaveAttribute('aria-current', 'page')
  })

  it('qualifies a lead from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l1'))
    await user.click(screen.getByTestId('detail-qualify'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('qualified')
    expect(screen.getByTestId('detail-qualify')).toBeDisabled()
  })

  it('disables qualify for a non-new lead', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l2'))
    expect(screen.getByTestId('detail-qualify')).toBeDisabled()
  })

  it('loses a lead from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l1'))
    await user.click(screen.getByTestId('detail-lose'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('lost')
    expect(screen.getByTestId('detail-convert')).toBeDisabled()
  })
})
