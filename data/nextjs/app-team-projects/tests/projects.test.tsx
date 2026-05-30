import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('projects list and detail', () => {
  it('lists seeded projects with task counts', () => {
    render(<App />)
    expect(screen.getByTestId('project-p1-name')).toHaveTextContent('Website')
    expect(screen.getByTestId('project-p1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('project-p3-count')).toHaveTextContent('1')
    expect(screen.getByTestId('project-p2-count')).toHaveTextContent('0')
  })

  it('opens a project detail when clicking open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    expect(screen.getByTestId('page-project-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Website')
    expect(screen.getByTestId('nav-project-detail')).toHaveAttribute('aria-current', 'page')
  })

  it('detail page lists only the project tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    const list = screen.getByTestId('detail-tasks')
    expect(within(list).getByTestId('detail-task-k1')).toBeInTheDocument()
    expect(within(list).getByTestId('detail-task-k2')).toBeInTheDocument()
    expect(within(list).queryByTestId('detail-task-k3')).not.toBeInTheDocument()
  })

  it('shows assignee names and statuses on detail tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    expect(screen.getByTestId('detail-task-k1-assignee')).toHaveTextContent('Ada')
    expect(screen.getByTestId('detail-task-k2-assignee')).toHaveTextContent('Grace')
    expect(screen.getByTestId('detail-task-k1')).toHaveAttribute('data-status', 'doing')
  })

  it('reassigns a task to another member', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    await user.selectOptions(screen.getByTestId('reassign-k2'), 'm3')
    expect(screen.getByTestId('detail-task-k2-assignee')).toHaveTextContent('Linus')
  })

  it('reassigns a task to unassigned', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-p1'))
    await user.selectOptions(screen.getByTestId('reassign-k1'), 'unassigned')
    expect(screen.getByTestId('detail-task-k1-assignee')).toHaveTextContent('Unassigned')
  })

  it('reassigning updates member workload counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Ada (m1) starts with 2 tasks (k1, k3)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('member-m1-load')).toHaveTextContent('2')
    // reassign k1 to Linus
    await user.click(screen.getByTestId('nav-projects'))
    await user.click(screen.getByTestId('open-p1'))
    await user.selectOptions(screen.getByTestId('reassign-k1'), 'm3')
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('member-m1-load')).toHaveTextContent('1')
    expect(screen.getByTestId('member-m3-load')).toHaveTextContent('1')
  })
})
