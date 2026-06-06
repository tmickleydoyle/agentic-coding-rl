import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Grade Book', () => {
  beforeEach(() => render(<App />))

  it('renders heading', () => {
    expect(screen.getByRole('heading', { name: /grade book/i })).toBeInTheDocument()
  })

  it('renders 3 seed student rows', () => {
    expect(screen.getAllByTestId('student-row')).toHaveLength(3)
  })

  it('shows seed student names', () => {
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Carol')).toBeInTheDocument()
  })

  it('shows correct average for Alice (92, 85, 78) = 85.0', () => {
    const avgs = screen.getAllByTestId('student-avg')
    expect(avgs[0].textContent).toBe('85.0')
  })

  it('shows correct average for Bob (76, 90, 88) = 84.7', () => {
    const avgs = screen.getAllByTestId('student-avg')
    expect(avgs[1].textContent).toBe('84.7')
  })

  it('shows class math average', () => {
    // (92 + 76 + 88) / 3 = 85.3
    expect(screen.getByTestId('class-avg-math').textContent).toMatch(/85\.3/)
  })

  it('shows class science average', () => {
    // (85 + 90 + 72) / 3 = 82.3
    expect(screen.getByTestId('class-avg-science').textContent).toMatch(/82\.3/)
  })

  it('shows class english average', () => {
    // (78 + 88 + 95) / 3 = 87.0
    expect(screen.getByTestId('class-avg-english').textContent).toMatch(/87\.0/)
  })

  it('adds a new student row', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/student name/i), 'Dave')
    await user.type(screen.getByLabelText(/math grade/i), '80')
    await user.type(screen.getByLabelText(/science grade/i), '80')
    await user.type(screen.getByLabelText(/english grade/i), '80')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(screen.getAllByTestId('student-row')).toHaveLength(4)
    expect(screen.getByText('Dave')).toBeInTheDocument()
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    const nameInput = screen.getByLabelText(/student name/i)
    await user.type(nameInput, 'Eve')
    await user.type(screen.getByLabelText(/math grade/i), '70')
    await user.type(screen.getByLabelText(/science grade/i), '70')
    await user.type(screen.getByLabelText(/english grade/i), '70')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(nameInput).toHaveValue('')
  })

  it('does not add student with empty name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/math grade/i), '80')
    await user.type(screen.getByLabelText(/science grade/i), '80')
    await user.type(screen.getByLabelText(/english grade/i), '80')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(screen.getAllByTestId('student-row')).toHaveLength(3)
  })

  it('updates class averages after adding student', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/student name/i), 'Frank')
    await user.type(screen.getByLabelText(/math grade/i), '100')
    await user.type(screen.getByLabelText(/science grade/i), '100')
    await user.type(screen.getByLabelText(/english grade/i), '100')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    // Math avg should now include 100
    const mathAvgText = screen.getByTestId('class-avg-math').textContent ?? ''
    const val = parseFloat(mathAvgText.replace(/[^0-9.]/g, ''))
    expect(val).toBeGreaterThan(85)
  })

  it('does not add student with grade out of range', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/student name/i), 'Ghost')
    await user.type(screen.getByLabelText(/math grade/i), '150')
    await user.type(screen.getByLabelText(/science grade/i), '80')
    await user.type(screen.getByLabelText(/english grade/i), '80')
    await user.click(screen.getByRole('button', { name: /add student/i }))
    expect(screen.getAllByTestId('student-row')).toHaveLength(3)
  })
})
