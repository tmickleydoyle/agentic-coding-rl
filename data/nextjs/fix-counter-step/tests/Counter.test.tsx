import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '../components/Counter'

describe('Counter', () => {
  it('starts at 0', () => {
    render(<Counter />)
    expect(screen.getByTestId('value')).toHaveTextContent('0')
  })

  it('increments by exactly 1 per click', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByTestId('inc'))
    expect(screen.getByTestId('value')).toHaveTextContent('1')
  })

  it('reaches 3 after three increments', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('inc'))
    expect(screen.getByTestId('value')).toHaveTextContent('3')
  })

  it('decrements by 1', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('dec'))
    expect(screen.getByTestId('value')).toHaveTextContent('1')
  })

  it('clamps at 0 and never goes negative', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByTestId('dec'))
    await user.click(screen.getByTestId('dec'))
    expect(screen.getByTestId('value')).toHaveTextContent('0')
  })
})
