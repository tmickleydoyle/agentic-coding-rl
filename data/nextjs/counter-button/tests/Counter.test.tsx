import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '../components/Counter'

describe('Counter', () => {
  it('starts at 0', () => {
    render(<Counter />)
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('increments by 1 on click', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByRole('button', { name: /increment/i }))
    expect(screen.getByTestId('count')).toHaveTextContent('1')
  })

  it('increments multiple times', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    const btn = screen.getByRole('button', { name: /increment/i })
    await user.click(btn)
    await user.click(btn)
    await user.click(btn)
    expect(screen.getByTestId('count')).toHaveTextContent('3')
  })
})
