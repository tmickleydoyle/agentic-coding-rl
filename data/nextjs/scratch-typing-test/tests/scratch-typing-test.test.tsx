import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

const PASSAGE = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump."

describe('Typing Test', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows the passage', () => {
    expect(screen.getByTestId('passage')).toHaveTextContent(PASSAGE)
  })

  it('shows initial status "Press Start to begin"', () => {
    expect(screen.getByTestId('status')).toHaveTextContent('Press Start to begin')
  })

  it('shows initial WPM: 0', () => {
    expect(screen.getByTestId('wpm')).toHaveTextContent('WPM: 0')
  })

  it('shows initial Accuracy: 100%', () => {
    expect(screen.getByTestId('accuracy')).toHaveTextContent('Accuracy: 100%')
  })

  it('textarea is disabled before start', () => {
    expect(screen.getByLabelText('Type here')).toBeDisabled()
  })

  it('shows Start button initially', () => {
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('enables textarea after clicking Start', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /start/i }))
    expect(screen.getByLabelText('Type here')).not.toBeDisabled()
  })

  it('changes status to Typing... after Start', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /start/i }))
    expect(screen.getByTestId('status')).toHaveTextContent('Typing...')
  })

  it('shows Reset button after Start', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /start/i }))
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument()
  })

  it('accuracy drops when typing wrong characters', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /start/i }))
    await user.type(screen.getByLabelText('Type here'), 'zzz')
    const accText = screen.getByTestId('accuracy').textContent ?? ''
    const accNum = parseInt(accText.replace(/[^0-9]/g, ''))
    expect(accNum).toBeLessThan(100)
  })

  it('accuracy stays 100% when typing correctly', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /start/i }))
    await user.type(screen.getByLabelText('Type here'), 'The')
    expect(screen.getByTestId('accuracy')).toHaveTextContent('Accuracy: 100%')
  })

  it('reset restores initial state', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /start/i }))
    await user.type(screen.getByLabelText('Type here'), 'Hello')
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('status')).toHaveTextContent('Press Start to begin')
    expect(screen.getByTestId('wpm')).toHaveTextContent('WPM: 0')
    expect(screen.getByTestId('accuracy')).toHaveTextContent('Accuracy: 100%')
    expect(screen.getByLabelText('Type here')).toBeDisabled()
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('shows Finished! when passage fully typed', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /start/i }))
    await user.type(screen.getByLabelText('Type here'), PASSAGE)
    expect(screen.getByTestId('status')).toHaveTextContent('Finished!')
  })

  it('disables textarea after finishing', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /start/i }))
    await user.type(screen.getByLabelText('Type here'), PASSAGE)
    expect(screen.getByLabelText('Type here')).toBeDisabled()
  })
})
