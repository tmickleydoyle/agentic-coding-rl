import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('issue flow', () => {
  it('lists seeded issues with assignee text', () => {
    render(<App />)
    const list = screen.getByTestId('issue-list')
    expect(within(list).getByText('Login button broken')).toBeInTheDocument()
    expect(screen.getByTestId('issue-i1-assignee')).toHaveTextContent('alice')
    expect(screen.getByTestId('issue-i2-assignee')).toHaveTextContent('Unassigned')
  })

  it('reflects priority on the issue row', () => {
    render(<App />)
    expect(screen.getByTestId('issue-i1')).toHaveAttribute('data-priority', 'high')
    expect(screen.getByTestId('issue-i3')).toHaveAttribute('data-priority', 'low')
  })

  it('shows a no-selection message before opening', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-issue-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('opening an issue shows its details and labels', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-i1'))
    expect(screen.getByTestId('page-issue-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Login button broken')
    expect(screen.getByTestId('detail-priority')).toHaveTextContent('high')
    expect(screen.getByTestId('detail-assignee')).toHaveTextContent('alice')
    const labels = screen.getByTestId('detail-labels')
    expect(within(labels).getByTestId('label-bug')).toBeInTheDocument()
    expect(within(labels).getByTestId('label-ui')).toBeInTheDocument()
  })

  it('assigns an issue from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-i2'))
    expect(screen.getByTestId('detail-assignee')).toHaveTextContent('Unassigned')
    await user.type(screen.getByTestId('assignee-input'), 'carol')
    await user.click(screen.getByTestId('assign-btn'))
    expect(screen.getByTestId('detail-assignee')).toHaveTextContent('carol')
  })

  it('unassigns when assigning an empty value', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-i1'))
    expect(screen.getByTestId('detail-assignee')).toHaveTextContent('alice')
    await user.click(screen.getByTestId('assign-btn'))
    expect(screen.getByTestId('detail-assignee')).toHaveTextContent('Unassigned')
  })

  it('changes the priority from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-i3'))
    expect(screen.getByTestId('detail-priority')).toHaveTextContent('low')
    await user.selectOptions(screen.getByTestId('priority-select'), 'high')
    expect(screen.getByTestId('detail-priority')).toHaveTextContent('high')
  })

  it('persists an assignment back on the issues list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-i2'))
    await user.type(screen.getByTestId('assignee-input'), 'dave')
    await user.click(screen.getByTestId('assign-btn'))
    await user.click(screen.getByTestId('nav-issues'))
    expect(screen.getByTestId('issue-i2-assignee')).toHaveTextContent('dave')
  })
})
