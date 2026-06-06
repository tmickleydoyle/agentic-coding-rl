import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Color Palette', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /color palette/i })).toBeInTheDocument()
  })

  it('shows initial swatch count', () => {
    expect(screen.getByTestId('swatch-count')).toHaveTextContent('5')
  })

  it('shows seed swatch names', () => {
    expect(screen.getByTestId('swatch-name-ocean-blue')).toHaveTextContent('Ocean Blue')
    expect(screen.getByTestId('swatch-name-forest-green')).toHaveTextContent('Forest Green')
    expect(screen.getByTestId('swatch-name-charcoal')).toHaveTextContent('Charcoal')
  })

  it('shows seed swatch hex values', () => {
    expect(screen.getByTestId('swatch-hex-ocean-blue')).toHaveTextContent('#1E90FF')
    expect(screen.getByTestId('swatch-hex-lavender')).toHaveTextContent('#967BB6')
  })

  it('renders swatch boxes with correct background color', () => {
    const box = screen.getByTestId('swatch-box-ocean-blue')
    expect(box).toBeInTheDocument()
  })

  it('shows CSS output with seed swatches', () => {
    const css = screen.getByTestId('css-output')
    expect(css).toHaveValue(expect.stringContaining('--ocean-blue: #1E90FF;'))
    expect(css).toHaveValue(expect.stringContaining('--charcoal: #36454F;'))
  })

  it('CSS output is wrapped in :root {}', () => {
    const css = screen.getByTestId('css-output')
    expect(css).toHaveValue(expect.stringContaining(':root {'))
  })

  it('removes a swatch', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /remove ocean blue/i }))
    expect(screen.queryByTestId('swatch-name-ocean-blue')).not.toBeInTheDocument()
    expect(screen.getByTestId('swatch-count')).toHaveTextContent('4')
  })

  it('CSS output updates after remove', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /remove ocean blue/i }))
    const css = screen.getByTestId('css-output')
    expect(css).not.toHaveValue(expect.stringContaining('--ocean-blue'))
  })

  it('adds a valid swatch', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/color name/i), 'Mint')
    await user.type(screen.getByLabelText(/hex value/i), '#98FF98')
    await user.click(screen.getByRole('button', { name: /add swatch/i }))
    expect(screen.getByTestId('swatch-name-mint')).toHaveTextContent('Mint')
    expect(screen.getByTestId('swatch-count')).toHaveTextContent('6')
  })

  it('CSS output includes newly added swatch', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/color name/i), 'Mint')
    await user.type(screen.getByLabelText(/hex value/i), '#98FF98')
    await user.click(screen.getByRole('button', { name: /add swatch/i }))
    expect(screen.getByTestId('css-output')).toHaveValue(expect.stringContaining('--mint: #98FF98;'))
  })

  it('rejects invalid hex value', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/color name/i), 'Bad Color')
    await user.type(screen.getByLabelText(/hex value/i), 'notahex')
    await user.click(screen.getByRole('button', { name: /add swatch/i }))
    expect(screen.getByTestId('swatch-count')).toHaveTextContent('5')
  })

  it('rejects empty name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/hex value/i), '#FF0000')
    await user.click(screen.getByRole('button', { name: /add swatch/i }))
    expect(screen.getByTestId('swatch-count')).toHaveTextContent('5')
  })

  it('clears inputs after successful add', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/color name/i), 'Mint')
    await user.type(screen.getByLabelText(/hex value/i), '#98FF98')
    await user.click(screen.getByRole('button', { name: /add swatch/i }))
    expect(screen.getByLabelText(/color name/i)).toHaveValue('')
    expect(screen.getByLabelText(/hex value/i)).toHaveValue('')
  })
})
