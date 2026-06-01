import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const col = (name: string) => screen.getByRole('region', { name })

async function addTask(u: U, title: string) {
  await u.clear(screen.getByLabelText(/new task/i))
  await u.type(screen.getByLabelText(/new task/i), title)
  await u.click(screen.getByRole('button', { name: /add task/i }))
}
function taskRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('ProjectHub app', () => {
  it('starts on the Board view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(0\)/i })).toBeInTheDocument()
  })

  it('navigates between all four views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Backlog')
    expect(screen.getByRole('heading', { name: 'Backlog' })).toBeInTheDocument()
    await nav(u, 'Reports')
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Board')
    expect(screen.getByRole('heading', { name: 'Board' })).toBeInTheDocument()
  })

  it('adds a task to To Do', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Write spec')
    expect(within(col('To Do')).getByText('Write spec')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(1\)/i })).toBeInTheDocument()
  })

  it('ignores a blank task title', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('heading', { name: /to do \(0\)/i })).toBeInTheDocument()
  })

  it('moves a task across columns with disabled bounds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Ship it')
    expect(within(taskRow('Ship it')).getByRole('button', { name: /move ship it left/i })).toBeDisabled()
    await u.click(within(taskRow('Ship it')).getByRole('button', { name: /move ship it right/i }))
    expect(within(col('Doing')).getByText('Ship it')).toBeInTheDocument()
    await u.click(within(taskRow('Ship it')).getByRole('button', { name: /move ship it right/i }))
    expect(within(col('Done')).getByText('Ship it')).toBeInTheDocument()
    expect(within(taskRow('Ship it')).getByRole('button', { name: /move ship it right/i })).toBeDisabled()
  })

  it('adds a backlog idea', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Backlog')
    await u.type(screen.getByLabelText(/backlog idea/i), 'Dark mode')
    await u.click(screen.getByRole('button', { name: /add idea/i }))
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('promotes a backlog idea into the board To Do (cross-route shared state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Backlog')
    await u.type(screen.getByLabelText(/backlog idea/i), 'Onboarding flow')
    await u.click(screen.getByRole('button', { name: /add idea/i }))
    await u.click(screen.getByRole('button', { name: /promote onboarding flow/i }))
    // gone from backlog
    expect(screen.queryByText('Onboarding flow')).not.toBeInTheDocument()
    await nav(u, 'Board')
    expect(within(col('To Do')).getByText('Onboarding flow')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /to do \(1\)/i })).toBeInTheDocument()
  })

  it('reports derived stats from the board', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'A')
    await addTask(u, 'B')
    await u.click(within(taskRow('A')).getByRole('button', { name: /move a right/i }))
    await u.click(within(taskRow('A')).getByRole('button', { name: /move a right/i })) // A -> Done
    await nav(u, 'Reports')
    expect(screen.getByText(/total tasks: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/done: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/completion: 50%/i)).toBeInTheDocument()
  })

  it('toggles the theme via data-theme and persists it across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reports')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides Done tasks on the board when Show completed is off', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Finished')
    await u.click(within(taskRow('Finished')).getByRole('button', { name: /move finished right/i }))
    await u.click(within(taskRow('Finished')).getByRole('button', { name: /move finished right/i }))
    expect(within(col('Done')).getByText('Finished')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show completed/i))
    await nav(u, 'Board')
    expect(within(col('Done')).queryByText('Finished')).not.toBeInTheDocument()
    // still counted in Reports
    await nav(u, 'Reports')
    expect(screen.getByText(/done: 1/i)).toBeInTheDocument()
  })

  it('keeps board state when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTask(u, 'Persisted')
    await nav(u, 'Settings')
    await nav(u, 'Board')
    expect(within(col('To Do')).getByText('Persisted')).toBeInTheDocument()
  })
})
