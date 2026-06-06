import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Standup Notes', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /standup notes/i })).toBeInTheDocument()
  })

  it('shows 3 seed member sections', () => {
    render(<App />)
    expect(screen.getAllByTestId('member-section')).toHaveLength(3)
  })

  it('shows member count as 3', () => {
    render(<App />)
    expect(screen.getByTestId('member-count').textContent).toBe('3')
  })

  it('seeds date input', () => {
    render(<App />)
    const dateInput = screen.getByLabelText(/^date$/i) as HTMLInputElement
    expect(dateInput.value).toBe('2024-01-15')
  })

  it('has textarea for each field per member', () => {
    render(<App />)
    expect(screen.getByLabelText('Alice - Yesterday')).toBeInTheDocument()
    expect(screen.getByLabelText('Alice - Today')).toBeInTheDocument()
    expect(screen.getByLabelText('Alice - Blockers')).toBeInTheDocument()
    expect(screen.getByLabelText('Bob - Yesterday')).toBeInTheDocument()
  })

  it('does not show output before generate', () => {
    render(<App />)
    expect(screen.queryByTestId('output')).not.toBeInTheDocument()
  })

  it('generates output with correct header', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /generate/i }))
    const output = screen.getByTestId('output')
    expect(output.textContent).toContain('Standup Notes - 2024-01-15')
  })

  it('generated output shows None for empty blockers', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /generate/i }))
    const output = screen.getByTestId('output').textContent ?? ''
    expect(output).toContain('Blockers: None')
  })

  it('generated output includes typed notes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Alice - Yesterday'), 'Finished PR review')
    await user.type(screen.getByLabelText('Alice - Today'), 'Write tests')
    await user.click(screen.getByRole('button', { name: /generate/i }))
    const output = screen.getByTestId('output').textContent ?? ''
    expect(output).toContain('Yesterday: Finished PR review')
    expect(output).toContain('Today: Write tests')
  })

  it('generated output includes blocker text', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Bob - Blockers'), 'Waiting for access')
    await user.click(screen.getByRole('button', { name: /generate/i }))
    const output = screen.getByTestId('output').textContent ?? ''
    expect(output).toContain('Blockers: Waiting for access')
  })

  it('adds a new member', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/new member name/i), 'Dave')
    await user.click(screen.getByRole('button', { name: /add member/i }))
    expect(screen.getAllByTestId('member-section')).toHaveLength(4)
    expect(screen.getByTestId('member-count').textContent).toBe('4')
  })

  it('does not add member with empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /add member/i }))
    expect(screen.getAllByTestId('member-section')).toHaveLength(3)
  })

  it('removes a member', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /remove alice/i }))
    expect(screen.getAllByTestId('member-section')).toHaveLength(2)
    expect(screen.getByTestId('member-count').textContent).toBe('2')
  })

  it('clear all resets all textarea values', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Alice - Yesterday'), 'some work')
    await user.click(screen.getByRole('button', { name: /clear all/i }))
    const ta = screen.getByLabelText('Alice - Yesterday') as HTMLTextAreaElement
    expect(ta.value).toBe('')
  })

  it('clear all hides generated output', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /generate/i }))
    expect(screen.getByTestId('output')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /clear all/i }))
    expect(screen.queryByTestId('output')).not.toBeInTheDocument()
  })
})
