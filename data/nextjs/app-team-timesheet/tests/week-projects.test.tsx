import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('week grid and projects', () => {
  it('shows the grand week total', () => {
    render(<App />)
    expect(screen.getByTestId('week-total')).toHaveTextContent('12')
  })

  it('shows per-day totals', () => {
    render(<App />)
    // mon: h1 (4) + h3 (5) = 9; tue: h2 (3) = 3
    expect(screen.getByTestId('day-mon-total')).toHaveTextContent('9')
    expect(screen.getByTestId('day-tue-total')).toHaveTextContent('3')
    expect(screen.getByTestId('day-wed-total')).toHaveTextContent('0')
  })

  it('places entries under the right day with project and hours', () => {
    render(<App />)
    const mon = screen.getByTestId('day-mon')
    expect(within(mon).getByTestId('entry-h1')).toBeInTheDocument()
    expect(within(mon).getByTestId('entry-h3')).toBeInTheDocument()
    expect(screen.getByTestId('entry-h1-project')).toHaveTextContent('Alpha')
    expect(screen.getByTestId('entry-h1-hours')).toHaveTextContent('4')
  })

  it('marks submitted entries on the week grid', () => {
    render(<App />)
    expect(screen.getByTestId('entry-h3')).toHaveAttribute('data-submitted', 'true')
    expect(screen.getByTestId('entry-h1')).toHaveAttribute('data-submitted', 'false')
  })

  it('shows per-project weekly totals on the projects page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-projects'))
    expect(screen.getByTestId('project-p1-total')).toHaveTextContent('7')
    expect(screen.getByTestId('project-p2-total')).toHaveTextContent('5')
    expect(screen.getByTestId('project-p3-total')).toHaveTextContent('0')
  })
})
