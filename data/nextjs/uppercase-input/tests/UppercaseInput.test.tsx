import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UppercaseInput from '../components/UppercaseInput'

describe('UppercaseInput', () => {
  it('echo starts empty', () => {
    render(<UppercaseInput />)
    expect(screen.getByTestId('echo')).toHaveTextContent('')
  })

  it('echoes uppercase as user types', async () => {
    const user = userEvent.setup()
    render(<UppercaseInput />)
    await user.type(screen.getByTestId('input'), 'hello world')
    expect(screen.getByTestId('echo')).toHaveTextContent('HELLO WORLD')
  })

  it('echo clears when input is cleared', async () => {
    const user = userEvent.setup()
    render(<UppercaseInput />)
    const inp = screen.getByTestId('input')
    await user.type(inp, 'abc')
    await user.clear(inp)
    expect(screen.getByTestId('echo')).toHaveTextContent('')
  })
})
