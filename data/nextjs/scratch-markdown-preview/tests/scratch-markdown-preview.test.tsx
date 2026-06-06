import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Markdown Preview', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    render(<App />)
  })

  it('renders seed markdown on initial render', () => {
    const preview = screen.getByTestId('preview-area')
    expect(preview.querySelector('h1')).not.toBeNull()
  })

  it('seed preview contains h1 Welcome', () => {
    const preview = screen.getByTestId('preview-area')
    expect(preview.querySelector('h1')!.textContent).toBe('Welcome')
  })

  it('seed preview contains h2 Features', () => {
    const preview = screen.getByTestId('preview-area')
    expect(preview.querySelector('h2')!.textContent).toBe('Features')
  })

  it('seed preview contains a ul list', () => {
    const preview = screen.getByTestId('preview-area')
    expect(preview.querySelector('ul')).not.toBeNull()
  })

  it('seed preview contains blockquote', () => {
    const preview = screen.getByTestId('preview-area')
    expect(preview.querySelector('blockquote')).not.toBeNull()
  })

  it('seed preview renders **bold** as strong', () => {
    const preview = screen.getByTestId('preview-area')
    expect(preview.querySelector('strong')).not.toBeNull()
  })

  it('char-count reflects seed length', () => {
    const count = screen.getByTestId('char-count')
    const num = parseInt(count.textContent ?? '0', 10)
    expect(num).toBeGreaterThan(0)
  })

  it('word-count reflects seed words', () => {
    const count = screen.getByTestId('word-count')
    const num = parseInt(count.textContent ?? '0', 10)
    expect(num).toBeGreaterThan(0)
  })

  it('preview updates live when user types', async () => {
    const user = userEvent.setup()
    const textarea = screen.getByLabelText('Markdown Input')
    await user.clear(textarea)
    await user.type(textarea, '# Hello World')
    const preview = screen.getByTestId('preview-area')
    expect(preview.querySelector('h1')!.textContent).toBe('Hello World')
  })

  it('Clear button empties textarea', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByLabelText('Markdown Input')).toHaveValue('')
  })

  it('char-count is 0 after clearing', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByTestId('char-count')).toHaveTextContent('0 characters')
  })

  it('copy-indicator not shown initially', () => {
    expect(screen.queryByTestId('copy-indicator')).not.toBeInTheDocument()
  })

  it('copy indicator shown after Copy Markdown', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Copy Markdown' }))
    expect(screen.getByTestId('copy-indicator')).toBeInTheDocument()
  })

  it('copy indicator disappears when textarea changes', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Copy Markdown' }))
    await user.type(screen.getByLabelText('Markdown Input'), 'x')
    expect(screen.queryByTestId('copy-indicator')).not.toBeInTheDocument()
  })

  it('renders inline code with backticks', async () => {
    const user = userEvent.setup()
    const textarea = screen.getByLabelText('Markdown Input')
    await user.clear(textarea)
    await user.type(textarea, 'Use `console.log` here')
    const preview = screen.getByTestId('preview-area')
    expect(preview.querySelector('code')).not.toBeNull()
  })
})
