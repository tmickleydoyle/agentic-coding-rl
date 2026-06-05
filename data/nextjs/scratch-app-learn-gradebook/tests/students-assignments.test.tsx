import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('students + assignments management', () => {
  it('lists seeded students', () => {
    render(<App />)
    const list = screen.getByTestId('student-list')
    expect(within(list).getByTestId('student-s1-name')).toHaveTextContent('Ada')
    expect(within(list).getByTestId('student-s2-name')).toHaveTextContent('Linus')
    expect(within(list).getByTestId('student-s3-name')).toHaveTextContent('Grace')
  })

  it('adds a new student', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('student-name-input'), 'Dennis')
    await user.click(screen.getByTestId('add-student'))
    expect(screen.getByTestId('student-s4-name')).toHaveTextContent('Dennis')
  })

  it('blocks adding a blank student', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-student'))
    expect(screen.getByTestId('student-error')).toBeInTheDocument()
    expect(screen.queryByTestId('student-s4')).not.toBeInTheDocument()
  })

  it('lists and adds assignments', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-assignments'))
    expect(screen.getByTestId('assignment-a1-title')).toHaveTextContent('Quiz')
    expect(screen.getByTestId('assignment-a2-title')).toHaveTextContent('Project')
    await user.type(screen.getByTestId('assignment-title-input'), 'Final')
    await user.click(screen.getByTestId('add-assignment'))
    expect(screen.getByTestId('assignment-a3-title')).toHaveTextContent('Final')
  })

  it('blocks adding a blank assignment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-assignments'))
    await user.click(screen.getByTestId('add-assignment'))
    expect(screen.getByTestId('assignment-error')).toBeInTheDocument()
  })
})
