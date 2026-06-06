import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Morse Code Translator', () => {
  it('renders the page title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /morse code translator/i })).toBeInTheDocument()
  })

  it('auto-translates seed data Hello World on mount', () => {
    render(<App />)
    const output = screen.getByTestId('output')
    expect(output.textContent).toContain('....')
    expect(output.textContent).toContain('/')
  })

  it('translates SOS text to morse', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/input/i)
    await user.clear(input)
    await user.type(input, 'SOS')
    await user.click(screen.getByRole('button', { name: /translate/i }))
    expect(screen.getByTestId('output').textContent).toBe('... --- ...')
  })

  it('translates Hello World text to morse correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/input/i)
    await user.clear(input)
    await user.type(input, 'Hello World')
    await user.click(screen.getByRole('button', { name: /translate/i }))
    expect(screen.getByTestId('output').textContent).toBe('.... . .-.. .-.. --- / .-- --- .-. .-.. -..')
  })

  it('switches to Morse to Text mode', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('mode-morse-to-text'))
    // mode switched — input and output cleared
    expect(screen.getByLabelText(/input/i)).toHaveValue('')
    expect(screen.getByTestId('output').textContent).toBe('')
  })

  it('translates morse to text SOS', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('mode-morse-to-text'))
    const input = screen.getByLabelText(/input/i)
    await user.type(input, '... --- ...')
    await user.click(screen.getByRole('button', { name: /translate/i }))
    expect(screen.getByTestId('output').textContent).toBe('SOS')
  })

  it('translates morse to text with word separator', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('mode-morse-to-text'))
    const input = screen.getByLabelText(/input/i)
    await user.type(input, '.... .. / .- .-.. .-.. ')
    await user.click(screen.getByRole('button', { name: /translate/i }))
    expect(screen.getByTestId('output').textContent).toContain('HI')
    expect(screen.getByTestId('output').textContent).toContain('ALL')
  })

  it('clears input and output on Clear', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('clear-btn'))
    expect(screen.getByLabelText(/input/i)).toHaveValue('')
    expect(screen.getByTestId('output').textContent).toBe('')
  })

  it('switching modes clears input and output', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('mode-morse-to-text'))
    expect(screen.getByLabelText(/input/i)).toHaveValue('')
    expect(screen.getByTestId('output').textContent).toBe('')
    await user.click(screen.getByTestId('mode-text-to-morse'))
    expect(screen.getByLabelText(/input/i)).toHaveValue('')
  })

  it('handles digits in text to morse', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/input/i)
    await user.clear(input)
    await user.type(input, '42')
    await user.click(screen.getByRole('button', { name: /translate/i }))
    expect(screen.getByTestId('output').textContent).toBe('....- ..---')
  })

  it('unknown morse symbol produces question mark', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('mode-morse-to-text'))
    const input = screen.getByLabelText(/input/i)
    await user.type(input, '.....')
    await user.click(screen.getByRole('button', { name: /translate/i }))
    // ..... is 5
    expect(screen.getByTestId('output').textContent).toBe('5')
  })

  it('shows mode buttons', () => {
    render(<App />)
    expect(screen.getByTestId('mode-text-to-morse')).toBeInTheDocument()
    expect(screen.getByTestId('mode-morse-to-text')).toBeInTheDocument()
  })
})
