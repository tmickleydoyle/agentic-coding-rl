// HELD-OUT generalization tests — overlaid only at eval.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function addTodo(u: ReturnType<typeof userEvent.setup>, text: string) {
  await u.clear(screen.getByLabelText(/new todo/i))
  await u.type(screen.getByLabelText(/new todo/i), text)
  await u.click(screen.getByRole('button', { name: /add todo/i }))
}

describe('Todo Filters (held-out)', () => {
  it('shows correct items left with multiple completions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Alpha')
    await addTodo(u, 'Beta')
    await addTodo(u, 'Gamma')
    await u.click(screen.getByLabelText(/toggle alpha/i))
    await u.click(screen.getByLabelText(/toggle gamma/i))
    expect(screen.getByText('1 items left')).toBeInTheDocument()
  })

  it('Active filter count is correct after toggling several items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'One')
    await addTodo(u, 'Two')
    await addTodo(u, 'Three')
    await u.click(screen.getByLabelText(/toggle two/i))
    await u.click(screen.getByRole('button', { name: /^active$/i }))
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Three')).toBeInTheDocument()
    expect(screen.queryByText('Two')).not.toBeInTheDocument()
  })

  it('Completed filter shows nothing when no todos are done', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Task X')
    await addTodo(u, 'Task Y')
    await u.click(screen.getByRole('button', { name: /^completed$/i }))
    expect(screen.queryByText('Task X')).not.toBeInTheDocument()
    expect(screen.queryByText('Task Y')).not.toBeInTheDocument()
  })

  it('deleting all todos leaves 0 items left', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Only one')
    const li = screen.getByText('Only one').closest('li') as HTMLElement
    await u.click(within(li).getByRole('button', { name: /delete/i }))
    expect(screen.getByText('0 items left')).toBeInTheDocument()
  })

  it('Clear completed leaves active todos and disables the button afterwards', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Stay')
    await addTodo(u, 'Go')
    await addTodo(u, 'AlsoGo')
    await u.click(screen.getByLabelText(/toggle go/i))
    await u.click(screen.getByLabelText(/toggle alsogo/i))
    await u.click(screen.getByRole('button', { name: /clear completed/i }))
    expect(screen.getByText('Stay')).toBeInTheDocument()
    expect(screen.queryByText('Go')).not.toBeInTheDocument()
    expect(screen.queryByText('AlsoGo')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear completed/i })).toBeDisabled()
  })

  it('switching filters back to All after Completed shows everything again', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Pending')
    await addTodo(u, 'Finished')
    await u.click(screen.getByLabelText(/toggle finished/i))
    await u.click(screen.getByRole('button', { name: /^completed$/i }))
    await u.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Finished')).toBeInTheDocument()
  })

  it('newly added todos appear in All and Active but not Completed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Brand new')
    await u.click(screen.getByRole('button', { name: /^active$/i }))
    expect(screen.getByText('Brand new')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /^completed$/i }))
    expect(screen.queryByText('Brand new')).not.toBeInTheDocument()
  })

  it('toggling a completed item back to active removes it from Completed filter view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addTodo(u, 'Flip me')
    await u.click(screen.getByLabelText(/toggle flip me/i))
    await u.click(screen.getByRole('button', { name: /^completed$/i }))
    expect(screen.getByText('Flip me')).toBeInTheDocument()
    await u.click(screen.getByLabelText(/toggle flip me/i))
    expect(screen.queryByText('Flip me')).not.toBeInTheDocument()
    expect(screen.getByText('1 items left')).toBeInTheDocument()
  })
})
