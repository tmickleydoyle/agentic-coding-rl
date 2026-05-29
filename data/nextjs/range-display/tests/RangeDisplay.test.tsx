import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RangeDisplay from '../components/RangeDisplay'

describe('RangeDisplay', () => {
  it('initializes at 50', () => {
    render(<RangeDisplay />)
    expect((screen.getByTestId('slider') as HTMLInputElement).value).toBe('50')
    expect(screen.getByTestId('value')).toHaveTextContent('50')
  })

  it('updates display when slider changes', () => {
    render(<RangeDisplay />)
    fireEvent.change(screen.getByTestId('slider'), { target: { value: '25' } })
    expect(screen.getByTestId('value')).toHaveTextContent('25')
  })

  it('handles min and max', () => {
    render(<RangeDisplay />)
    const sl = screen.getByTestId('slider')
    fireEvent.change(sl, { target: { value: '0' } })
    expect(screen.getByTestId('value')).toHaveTextContent('0')
    fireEvent.change(sl, { target: { value: '100' } })
    expect(screen.getByTestId('value')).toHaveTextContent('100')
  })
})
