import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('leads flow', () => {
  it('lists seeded leads', () => {
    render(<App />)
    const list = screen.getByTestId('lead-list')
    expect(within(list).getByText('Ava Stone')).toBeInTheDocument()
    expect(within(list).getByText('Ben Cole')).toBeInTheDocument()
    expect(within(list).getByText('Cara Diaz')).toBeInTheDocument()
  })

  it('shows the lead count', () => {
    render(<App />)
    expect(screen.getByTestId('lead-count')).toHaveTextContent('3')
  })

  it('shows the assigned property name on a lead row', () => {
    render(<App />)
    expect(screen.getByTestId('lead-l2-property')).toHaveTextContent('12 Oak St')
    expect(screen.getByTestId('lead-l1-property')).toHaveTextContent('Unassigned')
  })

  it('filters leads by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('status-filter'), 'touring')
    expect(screen.getByTestId('lead-l2')).toBeInTheDocument()
    expect(screen.queryByTestId('lead-l1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('lead-l3')).not.toBeInTheDocument()
  })

  it('shows an empty state when no lead matches the filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('status-filter'), 'closed')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('lead-list')).not.toBeInTheDocument()
  })

  it('opens a lead detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l3'))
    expect(screen.getByTestId('page-lead-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Cara Diaz')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('offer')
  })

  it('changes a lead status from the detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l1'))
    await user.selectOptions(screen.getByTestId('status-select'), 'closed')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('closed')
    await user.click(screen.getByTestId('detail-back'))
    expect(screen.getByTestId('lead-l1')).toHaveAttribute('data-status', 'closed')
  })

  it('assigns a property to a lead from the detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l1'))
    expect(screen.getByTestId('detail-property')).toHaveTextContent('Unassigned')
    await user.selectOptions(screen.getByTestId('assign-select'), 'p2')
    expect(screen.getByTestId('detail-property')).toHaveTextContent('500 Pine Ave')
    await user.click(screen.getByTestId('detail-back'))
    expect(screen.getByTestId('lead-l1-property')).toHaveTextContent('500 Pine Ave')
  })

  it('unassigns a property from a lead', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l2'))
    expect(screen.getByTestId('detail-property')).toHaveTextContent('12 Oak St')
    await user.selectOptions(screen.getByTestId('assign-select'), '')
    expect(screen.getByTestId('detail-property')).toHaveTextContent('Unassigned')
  })
})
