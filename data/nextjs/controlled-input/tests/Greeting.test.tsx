import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Greeting from '../components/Greeting'

describe('Greeting', () => {
  it('shows "Hello, stranger!" when input is empty', () => {
    render(<Greeting />)
    expect(screen.getByTestId('greeting')).toHaveTextContent('Hello, stranger!')
  })

  it('updates the greeting as the user types', async () => {
    const user = userEvent.setup()
    render(<Greeting />)
    const input = screen.getByLabelText(/your name/i)
    await user.type(input, 'Ada')
    expect(screen.getByTestId('greeting')).toHaveTextContent('Hello, Ada!')
  })

  it('reverts to "stranger" after clearing the input', async () => {
    const user = userEvent.setup()
    render(<Greeting />)
    const input = screen.getByLabelText(/your name/i)
    await user.type(input, 'Bob')
    await user.clear(input)
    expect(screen.getByTestId('greeting')).toHaveTextContent('Hello, stranger!')
  })
})
