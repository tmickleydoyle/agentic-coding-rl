import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Attendance Sheet', () => {
  beforeEach(() => render(<App />))

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /attendance sheet/i })).toBeInTheDocument()
  })

  it('shows 5 seed student rows', () => {
    expect(screen.getAllByTestId('attendance-row')).toHaveLength(5)
  })

  it('displays seed student names', () => {
    const names = screen.getAllByTestId('student-name').map(el => el.textContent)
    expect(names).toContain('Alice Johnson')
    expect(names).toContain('Eve Adams')
  })

  it('Alice has 4 present days initially', () => {
    const rows = screen.getAllByTestId('attendance-row')
    const aliceRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Alice Johnson')!
    expect(within(aliceRow).getByTestId('present-count').textContent).toBe('4')
  })

  it('Eve has 2 present days initially', () => {
    const rows = screen.getAllByTestId('attendance-row')
    const eveRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Eve Adams')!
    expect(within(eveRow).getByTestId('present-count').textContent).toBe('2')
  })

  it('shows attendance rate for Alice as 80%', () => {
    const rows = screen.getAllByTestId('attendance-row')
    const aliceRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Alice Johnson')!
    expect(within(aliceRow).getByTestId('attendance-rate').textContent).toBe('80%')
  })

  it('toggling a day updates present/absent counts', async () => {
    const user = userEvent.setup()
    // Alice Wed is absent, click to make present
    const btn = screen.getByTestId('day-Wed-1')
    expect(btn.textContent).toBe('absent')
    await user.click(btn)
    expect(btn.textContent).toBe('present')
    const rows = screen.getAllByTestId('attendance-row')
    const aliceRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Alice Johnson')!
    expect(within(aliceRow).getByTestId('present-count').textContent).toBe('5')
  })

  it('toggling updates attendance rate', async () => {
    const user = userEvent.setup()
    // Eve Mon: absent -> present
    await user.click(screen.getByTestId('day-Mon-5'))
    const rows = screen.getAllByTestId('attendance-row')
    const eveRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Eve Adams')!
    expect(within(eveRow).getByTestId('attendance-rate').textContent).toBe('60%')
  })

  it('shows total-present summary', () => {
    // 4+3+4+4+2 = 17
    expect(screen.getByTestId('total-present').textContent).toBe('17')
  })

  it('shows total-absent summary', () => {
    // 1+2+1+1+3 = 8
    expect(screen.getByTestId('total-absent').textContent).toBe('8')
  })

  it('adds a new student with 0% attendance', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/new student name/i), 'Frank')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(screen.getAllByTestId('attendance-row')).toHaveLength(6)
    const rows = screen.getAllByTestId('attendance-row')
    const frankRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Frank')!
    expect(within(frankRow).getByTestId('attendance-rate').textContent).toBe('0%')
  })

  it('does not add student with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(screen.getAllByTestId('attendance-row')).toHaveLength(5)
  })

  it('clears input after adding student', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/new student name/i), 'Grace')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(screen.getByLabelText(/new student name/i)).toHaveValue('')
  })
})
