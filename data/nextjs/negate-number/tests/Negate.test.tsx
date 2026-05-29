import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Negate from '../components/Negate'

describe('Negate', () => {
  it('result starts at 0', () => {
    render(<Negate />)
    expect(screen.getByTestId('result')).toHaveTextContent('0')
  })

  it('negates a positive number', async () => {
    const user = userEvent.setup()
    render(<Negate />)
    fireEvent.change(screen.getByTestId('input'), { target: { value: '7' } })
    await user.click(screen.getByTestId('negate'))
    expect(screen.getByTestId('result')).toHaveTextContent('-7')
  })

  it('negates a negative number to positive', async () => {
    const user = userEvent.setup()
    render(<Negate />)
    fireEvent.change(screen.getByTestId('input'), { target: { value: '-12' } })
    await user.click(screen.getByTestId('negate'))
    expect(screen.getByTestId('result')).toHaveTextContent('12')
  })

  it('result does not change just from editing the input', async () => {
    const user = userEvent.setup()
    render(<Negate />)
    fireEvent.change(screen.getByTestId('input'), { target: { value: '5' } })
    await user.click(screen.getByTestId('negate'))
    expect(screen.getByTestId('result')).toHaveTextContent('-5')
    fireEvent.change(screen.getByTestId('input'), { target: { value: '99' } })
    expect(screen.getByTestId('result')).toHaveTextContent('-5')
  })
})
