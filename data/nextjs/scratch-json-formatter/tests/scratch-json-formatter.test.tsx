import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('JSON Formatter', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    render(<App />)
  })

  it('shows Valid JSON status for seed input on render', () => {
    expect(screen.getByTestId('status')).toHaveTextContent('Valid JSON')
  })

  it('output is empty on initial render', () => {
    expect(screen.getByLabelText('Output JSON')).toHaveValue('')
  })

  it('Format button pretty-prints JSON', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Format' }))
    const output = screen.getByLabelText('Output JSON') as HTMLTextAreaElement
    const parsed = JSON.parse(output.value)
    expect(parsed.name).toBe('Alice')
    expect(output.value).toContain('\n')
  })

  it('Minify button compresses JSON to single line', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Format' }))
    await user.click(screen.getByRole('button', { name: 'Minify' }))
    const output = (screen.getByLabelText('Output JSON') as HTMLTextAreaElement).value
    expect(output).not.toContain('\n')
    expect(JSON.parse(output).name).toBe('Alice')
  })

  it('Format with 4 spaces uses 4-space indentation', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText('Indent'), '4 spaces')
    await user.click(screen.getByRole('button', { name: 'Format' }))
    const output = (screen.getByLabelText('Output JSON') as HTMLTextAreaElement).value
    expect(output).toContain('    ')
  })

  it('Clear button resets input, output, and status', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Format' }))
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByLabelText('Input JSON')).toHaveValue('')
    expect(screen.getByLabelText('Output JSON')).toHaveValue('')
    expect(screen.getByTestId('status')).toHaveTextContent('')
  })

  it('shows Invalid JSON for malformed input', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText('Input JSON')
    await user.clear(input)
    await user.type(input, '{bad json}')
    expect(screen.getByTestId('status')).toHaveTextContent('Invalid JSON')
  })

  it('Format on invalid JSON does not change output', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText('Input JSON')
    await user.clear(input)
    await user.type(input, '{bad}')
    await user.click(screen.getByRole('button', { name: 'Format' }))
    expect(screen.getByLabelText('Output JSON')).toHaveValue('')
  })

  it('status is empty when input is cleared', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText('Input JSON')
    await user.clear(input)
    expect(screen.getByTestId('status')).toHaveTextContent('')
  })

  it('copy indicator not shown initially', () => {
    expect(screen.queryByTestId('copy-indicator')).not.toBeInTheDocument()
  })

  it('shows copy indicator after Copy Output', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Format' }))
    await user.click(screen.getByRole('button', { name: 'Copy Output' }))
    expect(screen.getByTestId('copy-indicator')).toBeInTheDocument()
  })

  it('copy indicator disappears when input changes', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Format' }))
    await user.click(screen.getByRole('button', { name: 'Copy Output' }))
    const input = screen.getByLabelText('Input JSON')
    await user.type(input, ' ')
    expect(screen.queryByTestId('copy-indicator')).not.toBeInTheDocument()
  })

  it('calls clipboard writeText with output value', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Minify' }))
    await user.click(screen.getByRole('button', { name: 'Copy Output' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
  })
})
