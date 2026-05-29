import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Counter from '../components/Counter'

describe('Counter (uses useCounter hook)', () => {
  it('starts at 0', () => {
    render(<Counter />)
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('inc increments', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('inc'))
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('dec is clamped at 0', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByTestId('dec'))
    await user.click(screen.getByTestId('dec'))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })

  it('inc then dec works normally above 0', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('dec'))
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('reset returns to initial', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('inc'))
    await user.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})
