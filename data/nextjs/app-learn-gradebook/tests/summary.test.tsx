import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('summary derived view', () => {
  it('shows per-student averages and letter grades from seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-summary'))
    expect(screen.getByTestId('summary-s1-average')).toHaveTextContent('90')
    expect(screen.getByTestId('summary-s1-letter')).toHaveTextContent('A')
    expect(screen.getByTestId('summary-s2-average')).toHaveTextContent('72')
    expect(screen.getByTestId('summary-s2-letter')).toHaveTextContent('C')
    expect(screen.getByTestId('summary-s3-average')).toHaveTextContent('50')
    expect(screen.getByTestId('summary-s3-letter')).toHaveTextContent('F')
  })

  it('shows the class average and student count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-summary'))
    // mean(90,72,50) = 70.67 -> 71
    expect(screen.getByTestId('class-average-value')).toHaveTextContent('71')
    expect(screen.getByTestId('student-count-value')).toHaveTextContent('3')
  })

  it('a newly added student with no grades shows dashes and is excluded from class avg', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('student-name-input'), 'Dennis')
    await user.click(screen.getByTestId('add-student'))
    await user.click(screen.getByTestId('nav-summary'))
    expect(screen.getByTestId('summary-s4-average')).toHaveTextContent('—')
    expect(screen.getByTestId('summary-s4-letter')).toHaveTextContent('—')
    // class average unchanged
    expect(screen.getByTestId('class-average-value')).toHaveTextContent('71')
    expect(screen.getByTestId('student-count-value')).toHaveTextContent('4')
  })

  it('summary updates after editing a grade in the gradebook', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-gradebook'))
    await user.clear(screen.getByTestId('grade-s3-a1'))
    await user.type(screen.getByTestId('grade-s3-a1'), '95') // s3 now 95 -> A
    await user.click(screen.getByTestId('nav-summary'))
    expect(screen.getByTestId('summary-s3-average')).toHaveTextContent('95')
    expect(screen.getByTestId('summary-s3-letter')).toHaveTextContent('A')
  })
})
