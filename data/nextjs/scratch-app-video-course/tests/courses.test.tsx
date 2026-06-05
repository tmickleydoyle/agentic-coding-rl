import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('courses list', () => {
  it('lists seeded courses with total lesson counts', () => {
    render(<App />)
    const list = screen.getByTestId('course-list')
    expect(within(list).getByTestId('course-c1-title')).toHaveTextContent('React Mastery')
    expect(within(list).getByTestId('course-c1-lesson-count')).toHaveTextContent('4')
    expect(within(list).getByTestId('course-c2-title')).toHaveTextContent('CSS Pro')
    expect(within(list).getByTestId('course-c2-lesson-count')).toHaveTextContent('2')
  })

  it('starts every course at 0 percent', () => {
    render(<App />)
    expect(screen.getByTestId('course-c1-percent')).toHaveTextContent('0')
    expect(screen.getByTestId('course-c2-percent')).toHaveTextContent('0')
  })

  it('opening a course navigates to detail with modules', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    expect(screen.getByTestId('page-course-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('React Mastery')
    expect(screen.getByTestId('module-m1-title')).toHaveTextContent('Basics')
    expect(screen.getByTestId('module-m2-title')).toHaveTextContent('Hooks')
  })

  it('lists lessons within their modules', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    const m1 = screen.getByTestId('module-m1')
    expect(within(m1).getByTestId('lesson-c1-l1-title')).toHaveTextContent('JSX')
    expect(within(m1).getByTestId('lesson-c1-l2-title')).toHaveTextContent('Props')
    const m2 = screen.getByTestId('module-m2')
    expect(within(m2).getByTestId('lesson-c1-l3-title')).toHaveTextContent('useState')
  })
})
