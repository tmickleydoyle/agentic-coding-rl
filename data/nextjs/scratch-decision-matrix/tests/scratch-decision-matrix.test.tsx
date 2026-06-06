import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Decision Matrix', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /decision matrix/i })).toBeInTheDocument()
  })

  it('shows seed criteria headers', () => {
    expect(screen.getByText(/Cost/)).toBeInTheDocument()
    expect(screen.getByText(/Performance/)).toBeInTheDocument()
    expect(screen.getByText(/Ease of Use/)).toBeInTheDocument()
  })

  it('shows criterion weights in header', () => {
    expect(screen.getByText(/w=3/)).toBeInTheDocument()
    expect(screen.getByText(/w=5/)).toBeInTheDocument()
    expect(screen.getByText(/w=4/)).toBeInTheDocument()
  })

  it('shows seed options', () => {
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
    expect(screen.getByText('Option C')).toBeInTheDocument()
  })

  it('shows initial weighted totals (5*3 + 5*5 + 5*4 = 60)', () => {
    expect(screen.getByTestId('total-option-a')).toHaveTextContent('60')
    expect(screen.getByTestId('total-option-b')).toHaveTextContent('60')
    expect(screen.getByTestId('total-option-c')).toHaveTextContent('60')
  })

  it('shows initial ranks (all tied at 1)', () => {
    expect(screen.getByTestId('rank-option-a')).toHaveTextContent('1')
    expect(screen.getByTestId('rank-option-b')).toHaveTextContent('1')
    expect(screen.getByTestId('rank-option-c')).toHaveTextContent('1')
  })

  it('recalculates total when score changes', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText('Score for Option A on Cost')
    await user.clear(input)
    await user.type(input, '10')
    // 10*3 + 5*5 + 5*4 = 30+25+20 = 75
    expect(screen.getByTestId('total-option-a')).toHaveTextContent('75')
  })

  it('updates rank after score change', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText('Score for Option A on Performance')
    await user.clear(input)
    await user.type(input, '10')
    expect(screen.getByTestId('rank-option-a')).toHaveTextContent('1')
    expect(screen.getByTestId('rank-option-b')).toHaveTextContent('2')
  })

  it('adds a new criterion', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/criterion name/i), 'Support')
    await user.clear(screen.getByLabelText(/^weight$/i))
    await user.type(screen.getByLabelText(/^weight$/i), '2')
    await user.click(screen.getByRole('button', { name: /add criterion/i }))
    expect(screen.getByText(/Support/)).toBeInTheDocument()
    expect(screen.getByText(/w=2/)).toBeInTheDocument()
  })

  it('new criterion defaults existing options to score 5', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/criterion name/i), 'Support')
    await user.clear(screen.getByLabelText(/^weight$/i))
    await user.type(screen.getByLabelText(/^weight$/i), '2')
    await user.click(screen.getByRole('button', { name: /add criterion/i }))
    // total for option-a: 60 + 5*2 = 70
    expect(screen.getByTestId('total-option-a')).toHaveTextContent('70')
  })

  it('adds a new option', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/option name/i), 'Option D')
    await user.click(screen.getByRole('button', { name: /add option/i }))
    expect(screen.getByText('Option D')).toBeInTheDocument()
    expect(screen.getByTestId('total-option-d')).toHaveTextContent('60')
  })

  it('does not add criterion with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add criterion/i }))
    // still only 3 criteria headers with w=
    const wHeaders = screen.getAllByText(/w=\d/)
    expect(wHeaders).toHaveLength(3)
  })

  it('does not add option with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add option/i }))
    expect(screen.getAllByTestId(/^total-/)).toHaveLength(3)
  })
})
