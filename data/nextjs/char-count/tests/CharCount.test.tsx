import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CharCount from '../components/CharCount'

describe('CharCount', () => {
  it('starts at 0 with no warning', () => {
    render(<CharCount />)
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.queryByTestId('warning')).toBeNull()
  })

  it('updates count as user types', async () => {
    const user = userEvent.setup()
    render(<CharCount />)
    await user.type(screen.getByTestId('input'), 'hello')
    expect(screen.getByTestId('count')).toHaveTextContent('5')
    expect(screen.queryByTestId('warning')).toBeNull()
  })

  it('shows warning when length exceeds 100', async () => {
    const user = userEvent.setup()
    render(<CharCount />)
    const longText = 'a'.repeat(101)
    await user.type(screen.getByTestId('input'), longText)
    expect(screen.getByTestId('count')).toHaveTextContent('101')
    expect(screen.getByTestId('warning')).toHaveTextContent('Too long')
  })

  it('warning disappears when length drops back to 100', async () => {
    const user = userEvent.setup()
    render(<CharCount />)
    const input = screen.getByTestId('input') as HTMLInputElement
    await user.type(input, 'a'.repeat(101))
    expect(screen.getByTestId('warning')).toBeInTheDocument()
    await user.type(input, '{Backspace}')
    expect(screen.getByTestId('count')).toHaveTextContent('100')
    expect(screen.queryByTestId('warning')).toBeNull()
  })
})
