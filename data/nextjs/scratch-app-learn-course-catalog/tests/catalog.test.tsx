import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('catalog', () => {
  it('lists seeded courses with lesson counts', () => {
    render(<App />)
    const list = screen.getByTestId('course-list')
    expect(within(list).getByTestId('course-c1-title')).toHaveTextContent('Intro to React')
    expect(within(list).getByTestId('course-c1-lesson-count')).toHaveTextContent('4')
    expect(within(list).getByTestId('course-c2-title')).toHaveTextContent('TypeScript 101')
    expect(within(list).getByTestId('course-c2-lesson-count')).toHaveTextContent('2')
  })

  it('shows no enrolled badge initially', () => {
    render(<App />)
    expect(screen.queryByTestId('enrolled-badge-c1')).not.toBeInTheDocument()
  })

  it('opening a course navigates to detail with its title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    expect(screen.getByTestId('page-course-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Intro to React')
  })

  it('shows an enrolled badge after enrolling', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    await user.click(screen.getByTestId('enroll-toggle'))
    await user.click(screen.getByTestId('nav-catalog'))
    expect(screen.getByTestId('enrolled-badge-c1')).toBeInTheDocument()
    expect(screen.queryByTestId('enrolled-badge-c2')).not.toBeInTheDocument()
  })
})
