import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TempConverter from '../components/TempConverter'

describe('TempConverter', () => {
  it('is empty before any input', () => {
    render(<TempConverter />)
    expect(screen.getByTestId('fahrenheit')).toHaveTextContent('')
  })

  it('converts 0C to 32.0F', async () => {
    const user = userEvent.setup()
    render(<TempConverter />)
    await user.type(screen.getByTestId('celsius'), '0')
    expect(screen.getByTestId('fahrenheit')).toHaveTextContent('32.0')
  })

  it('converts 100C to 212.0F', async () => {
    const user = userEvent.setup()
    render(<TempConverter />)
    await user.type(screen.getByTestId('celsius'), '100')
    expect(screen.getByTestId('fahrenheit')).toHaveTextContent('212.0')
  })

  it('converts 37C to 98.6F', async () => {
    const user = userEvent.setup()
    render(<TempConverter />)
    await user.type(screen.getByTestId('celsius'), '37')
    expect(screen.getByTestId('fahrenheit')).toHaveTextContent('98.6')
  })

  it('handles negative values: -40C to -40.0F', async () => {
    const user = userEvent.setup()
    render(<TempConverter />)
    await user.type(screen.getByTestId('celsius'), '-40')
    expect(screen.getByTestId('fahrenheit')).toHaveTextContent('-40.0')
  })
})
