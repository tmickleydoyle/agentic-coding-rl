import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Color Contrast Checker', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /color contrast checker/i })).toBeInTheDocument()
  })

  it('seeds inputs with default colors', () => {
    render(<App />)
    const fg = screen.getByLabelText(/foreground color/i) as HTMLInputElement
    const bg = screen.getByLabelText(/background color/i) as HTMLInputElement
    expect(fg.value).toBe('#1a1a2e')
    expect(bg.value).toBe('#e0e0e0')
  })

  it('preview box is visible before checking', () => {
    render(<App />)
    expect(screen.getByTestId('preview-box')).toBeInTheDocument()
    expect(screen.getByTestId('preview-box').textContent).toBe('Sample Text')
  })

  it('does not show results before Check', () => {
    render(<App />)
    expect(screen.queryByTestId('results')).not.toBeInTheDocument()
  })

  it('shows contrast ratio after Check', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('results')).toBeInTheDocument()
    const ratio = screen.getByTestId('contrast-ratio').textContent ?? ''
    expect(ratio).toMatch(/\d+\.\d+:1/)
  })

  it('shows PASS for AA normal with high-contrast colors', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/foreground color/i))
    await user.type(screen.getByLabelText(/foreground color/i), '#000000')
    await user.clear(screen.getByLabelText(/background color/i))
    await user.type(screen.getByLabelText(/background color/i), '#ffffff')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('aa-normal').textContent).toBe('PASS')
    expect(screen.getByTestId('aa-large').textContent).toBe('PASS')
    expect(screen.getByTestId('aaa-normal').textContent).toBe('PASS')
    expect(screen.getByTestId('aaa-large').textContent).toBe('PASS')
  })

  it('shows FAIL for low-contrast colors', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/foreground color/i))
    await user.type(screen.getByLabelText(/foreground color/i), '#aaaaaa')
    await user.clear(screen.getByLabelText(/background color/i))
    await user.type(screen.getByLabelText(/background color/i), '#bbbbbb')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('aa-normal').textContent).toBe('FAIL')
    expect(screen.getByTestId('aaa-normal').textContent).toBe('FAIL')
  })

  it('black on white ratio is 21.00:1', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/foreground color/i))
    await user.type(screen.getByLabelText(/foreground color/i), '#000000')
    await user.clear(screen.getByLabelText(/background color/i))
    await user.type(screen.getByLabelText(/background color/i), '#ffffff')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('contrast-ratio').textContent).toBe('21.00:1')
  })

  it('shows error for invalid hex color', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/foreground color/i))
    await user.type(screen.getByLabelText(/foreground color/i), 'notacolor')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('contrast-error').textContent).toBe('Invalid hex color')
    expect(screen.queryByTestId('contrast-ratio')).not.toBeInTheDocument()
  })

  it('reset restores seed values and hides results', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('results')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.queryByTestId('results')).not.toBeInTheDocument()
    const fg = screen.getByLabelText(/foreground color/i) as HTMLInputElement
    expect(fg.value).toBe('#1a1a2e')
  })

  it('works with hex without # prefix', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/foreground color/i))
    await user.type(screen.getByLabelText(/foreground color/i), '000000')
    await user.clear(screen.getByLabelText(/background color/i))
    await user.type(screen.getByLabelText(/background color/i), 'ffffff')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('contrast-ratio').textContent).toBe('21.00:1')
  })

  it('same color has ratio 1.00:1', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/foreground color/i))
    await user.type(screen.getByLabelText(/foreground color/i), '#808080')
    await user.clear(screen.getByLabelText(/background color/i))
    await user.type(screen.getByLabelText(/background color/i), '#808080')
    await user.click(screen.getByRole('button', { name: /check/i }))
    expect(screen.getByTestId('contrast-ratio').textContent).toBe('1.00:1')
    expect(screen.getByTestId('aa-normal').textContent).toBe('FAIL')
  })
})
