import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Class Grades Tracker', () => {
  beforeEach(() => render(<App />))

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /class grades tracker/i })).toBeInTheDocument()
  })

  it('shows all 4 seed students', () => {
    expect(screen.getAllByTestId('student-row')).toHaveLength(4)
  })

  it('displays seed student names', () => {
    const names = screen.getAllByTestId('student-name').map(el => el.textContent)
    expect(names).toContain('Alice Johnson')
    expect(names).toContain('David Lee')
  })

  it('shows correct average for Alice (91.7)', () => {
    const rows = screen.getAllByTestId('student-row')
    const aliceRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Alice Johnson')!
    expect(within(aliceRow).getByTestId('student-avg').textContent).toBe('91.7')
  })

  it('shows letter grade A for Alice', () => {
    const rows = screen.getAllByTestId('student-row')
    const aliceRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Alice Johnson')!
    expect(within(aliceRow).getByTestId('student-letter').textContent).toBe('A')
  })

  it('shows letter grade C for Carol', () => {
    const rows = screen.getAllByTestId('student-row')
    const carolRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Carol White')!
    expect(within(carolRow).getByTestId('student-letter').textContent).toBe('C')
  })

  it('displays top student as David Lee', () => {
    expect(screen.getByTestId('top-student').textContent).toBe('David Lee')
  })

  it('adds a new student', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/student name/i), 'Eve Adams')
    await user.type(screen.getByLabelText(/^grade$/i), '85')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(screen.getAllByTestId('student-row')).toHaveLength(5)
    const names = screen.getAllByTestId('student-name').map(el => el.textContent)
    expect(names).toContain('Eve Adams')
  })

  it('does not add student with empty name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^grade$/i), '85')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(screen.getAllByTestId('student-row')).toHaveLength(4)
  })

  it('adds a grade to an existing student', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/select student/i), 'Bob Smith')
    await user.type(screen.getByLabelText(/new grade/i), '90')
    await user.click(screen.getByRole('button', { name: /add grade/i }))
    const rows = screen.getAllByTestId('student-row')
    const bobRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Bob Smith')!
    expect(within(bobRow).getByTestId('student-grades').textContent).toContain('90')
  })

  it('recalculates average after adding grade', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/select student/i), 'Carol White')
    await user.type(screen.getByLabelText(/new grade/i), '100')
    await user.click(screen.getByRole('button', { name: /add grade/i }))
    const rows = screen.getAllByTestId('student-row')
    const carolRow = rows.find(r => within(r).getByTestId('student-name').textContent === 'Carol White')!
    // (65+71+60+100)/4 = 74.0
    expect(within(carolRow).getByTestId('student-avg').textContent).toBe('74.0')
  })

  it('clears inputs after adding student', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/student name/i), 'Frank')
    await user.type(screen.getByLabelText(/^grade$/i), '75')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(screen.getByLabelText(/student name/i)).toHaveValue('')
  })

  it('shows class average', () => {
    const classAvgEl = screen.getByTestId('class-avg')
    expect(classAvgEl.textContent).toMatch(/\d+\.\d/)
  })
})
