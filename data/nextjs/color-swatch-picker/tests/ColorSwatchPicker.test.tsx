import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ColorSwatchPicker from '../components/ColorSwatchPicker'

describe('ColorSwatchPicker', () => {
  it('shows None as initial selected color', () => {
    render(<ColorSwatchPicker />)
    expect(screen.getByTestId('selected-color')).toHaveTextContent('None')
  })

  it('renders all five swatches', () => {
    render(<ColorSwatchPicker />)
    expect(screen.getByTestId('swatch-Red')).toBeTruthy()
    expect(screen.getByTestId('swatch-Green')).toBeTruthy()
    expect(screen.getByTestId('swatch-Blue')).toBeTruthy()
    expect(screen.getByTestId('swatch-Yellow')).toBeTruthy()
    expect(screen.getByTestId('swatch-Purple')).toBeTruthy()
  })

  it('selects Red when Red swatch is clicked', async () => {
    const user = userEvent.setup()
    render(<ColorSwatchPicker />)
    await user.click(screen.getByTestId('swatch-Red'))
    expect(screen.getByTestId('selected-color')).toHaveTextContent('Red')
  })

  it('sets aria-pressed true on selected swatch', async () => {
    const user = userEvent.setup()
    render(<ColorSwatchPicker />)
    await user.click(screen.getByTestId('swatch-Blue'))
    expect(screen.getByTestId('swatch-Blue')).toHaveAttribute('aria-pressed', 'true')
  })

  it('sets aria-pressed false on unselected swatches', async () => {
    const user = userEvent.setup()
    render(<ColorSwatchPicker />)
    await user.click(screen.getByTestId('swatch-Blue'))
    expect(screen.getByTestId('swatch-Red')).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches selection from one swatch to another', async () => {
    const user = userEvent.setup()
    render(<ColorSwatchPicker />)
    await user.click(screen.getByTestId('swatch-Green'))
    await user.click(screen.getByTestId('swatch-Purple'))
    expect(screen.getByTestId('selected-color')).toHaveTextContent('Purple')
    expect(screen.getByTestId('swatch-Green')).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('swatch-Purple')).toHaveAttribute('aria-pressed', 'true')
  })
})
