import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Exam Countdown', () => {
  beforeEach(() => render(<App />))

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /exam countdown/i })).toBeInTheDocument()
  })

  it('shows 5 seed exam cards', () => {
    expect(screen.getAllByTestId('exam-card')).toHaveLength(5)
  })

  it('displays exam titles', () => {
    const titles = screen.getAllByTestId('exam-title').map(el => el.textContent)
    expect(titles).toContain('Calculus Final')
    expect(titles).toContain('Algorithm Quiz')
  })

  it('shows correct days remaining for Calculus Final (7)', () => {
    const cards = screen.getAllByTestId('exam-card')
    const calcCard = cards.find(c => within(c).getByTestId('exam-title').textContent === 'Calculus Final')!
    expect(within(calcCard).getByTestId('exam-days').textContent).toBe('7')
  })

  it('shows 0 days for World War II Test (same day as reference)', () => {
    const cards = screen.getAllByTestId('exam-card')
    const card = cards.find(c => within(c).getByTestId('exam-title').textContent === 'World War II Test')!
    expect(within(card).getByTestId('exam-days').textContent).toBe('0')
  })

  it('shows next exam as World War II Test (0 days, earliest)', () => {
    expect(screen.getByTestId('next-exam').textContent).toBe('World War II Test')
  })

  it('shows total exam count of 5', () => {
    expect(screen.getByTestId('exam-count').textContent).toBe('5')
  })

  it('default sort is by date — first card is World War II Test', () => {
    const firstCard = screen.getAllByTestId('exam-card')[0]
    expect(within(firstCard).getByTestId('exam-title').textContent).toBe('World War II Test')
  })

  it('sorts by subject', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/sort by/i), 'Subject')
    const titles = screen.getAllByTestId('exam-subject').map(el => el.textContent!)
    const sorted = [...titles].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    expect(titles).toEqual(sorted)
  })

  it('sorts by days remaining', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/sort by/i), 'Days Remaining')
    const days = screen.getAllByTestId('exam-days').map(el => Number(el.textContent))
    for (let i = 1; i < days.length; i++) {
      expect(days[i]).toBeGreaterThanOrEqual(days[i - 1])
    }
  })

  it('removes an exam', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('exam-card')
    const calcCard = cards.find(c => within(c).getByTestId('exam-title').textContent === 'Calculus Final')!
    await user.click(within(calcCard).getByRole('button', { name: /remove/i }))
    expect(screen.getAllByTestId('exam-card')).toHaveLength(4)
    expect(screen.queryByText('Calculus Final')).not.toBeInTheDocument()
  })

  it('updates exam count after remove', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('exam-card')
    await user.click(within(cards[0]).getByRole('button', { name: /remove/i }))
    expect(screen.getByTestId('exam-count').textContent).toBe('4')
  })

  it('adds a new exam', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^subject$/i), 'Art')
    await user.type(screen.getByLabelText(/^title$/i), 'Portfolio Review')
    await user.click(screen.getByRole('button', { name: /add exam/i }))
    expect(screen.getAllByTestId('exam-card')).toHaveLength(6)
    expect(screen.getByText('Portfolio Review')).toBeInTheDocument()
  })

  it('does not add exam with empty title', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^subject$/i), 'PE')
    await user.click(screen.getByRole('button', { name: /add exam/i }))
    expect(screen.getAllByTestId('exam-card')).toHaveLength(5)
  })

  it('shows None for next exam when all are removed', async () => {
    const user = userEvent.setup()
    let buttons = screen.getAllByRole('button', { name: /remove/i })
    for (const btn of buttons) {
      await user.click(btn)
    }
    expect(screen.getByTestId('next-exam').textContent).toBe('None')
  })
})
