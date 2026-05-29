import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClearableInput from '../components/ClearableInput'

describe('ClearableInput', () => {
  it('clear is disabled when input is empty', () => {
    render(<ClearableInput />)
    expect(screen.getByTestId('clear')).toBeDisabled()
  })

  it('clear becomes enabled after typing', async () => {
    const user = userEvent.setup()
    render(<ClearableInput />)
    await user.type(screen.getByTestId('input'), 'x')
    expect(screen.getByTestId('clear')).not.toBeDisabled()
  })

  it('clicking Clear empties the input and disables itself again', async () => {
    const user = userEvent.setup()
    render(<ClearableInput />)
    await user.type(screen.getByTestId('input'), 'hello')
    await user.click(screen.getByTestId('clear'))
    expect((screen.getByTestId('input') as HTMLInputElement).value).toBe('')
    expect(screen.getByTestId('clear')).toBeDisabled()
  })
})
