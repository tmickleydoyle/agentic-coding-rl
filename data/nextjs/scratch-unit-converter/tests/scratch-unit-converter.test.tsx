import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Unit Converter', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the three category tabs', () => {
    expect(screen.getByRole('tab', { name: 'Length' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Weight' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Temperature' })).toBeInTheDocument()
  })

  it('shows Length tab as active by default', () => {
    expect(screen.getByRole('tab', { name: 'Length' })).toHaveAttribute('aria-selected', 'true')
  })

  it('result is empty on initial render', () => {
    expect(screen.getByTestId('result')).toHaveTextContent('')
  })

  it('converts meters to feet', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByLabelText('Value'))
    await user.type(screen.getByLabelText('Value'), '1')
    // default from=m, to=ft
    await user.click(screen.getByRole('button', { name: 'Convert' }))
    expect(screen.getByTestId('result')).toHaveTextContent('3.2808')
  })

  it('does nothing when value is empty', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Convert' }))
    expect(screen.getByTestId('result')).toHaveTextContent('')
  })

  it('swap button exchanges From and To units', async () => {
    const user = userEvent.setup()
    const fromSelect = screen.getByLabelText('From')
    const toSelect = screen.getByLabelText('To')
    expect(fromSelect).toHaveValue('m')
    expect(toSelect).toHaveValue('ft')
    await user.click(screen.getByRole('button', { name: 'Swap' }))
    expect(fromSelect).toHaveValue('ft')
    expect(toSelect).toHaveValue('m')
  })

  it('adds a history entry after conversion', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Value'), '100')
    await user.click(screen.getByRole('button', { name: 'Convert' }))
    expect(screen.getAllByTestId('history-item')).toHaveLength(1)
  })

  it('history shows newest entry first', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Value'), '1')
    await user.click(screen.getByRole('button', { name: 'Convert' }))
    await user.clear(screen.getByLabelText('Value'))
    await user.type(screen.getByLabelText('Value'), '2')
    await user.click(screen.getByRole('button', { name: 'Convert' }))
    const items = screen.getAllByTestId('history-item')
    expect(items[0].textContent).toContain('2 m')
    expect(items[1].textContent).toContain('1 m')
  })

  it('history is capped at 5 entries', async () => {
    const user = userEvent.setup()
    for (let i = 1; i <= 6; i++) {
      await user.clear(screen.getByLabelText('Value'))
      await user.type(screen.getByLabelText('Value'), String(i))
      await user.click(screen.getByRole('button', { name: 'Convert' }))
    }
    expect(screen.getAllByTestId('history-item')).toHaveLength(5)
  })

  it('switches to Weight tab and resets units', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('tab', { name: 'Weight' }))
    expect(screen.getByRole('tab', { name: 'Weight' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByLabelText('From')).toHaveValue('mg')
    expect(screen.getByLabelText('To')).toHaveValue('g')
  })

  it('converts temperature Celsius to Fahrenheit', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('tab', { name: 'Temperature' }))
    // from=°C to=°F default
    await user.type(screen.getByLabelText('Value'), '100')
    await user.click(screen.getByRole('button', { name: 'Convert' }))
    expect(screen.getByTestId('result')).toHaveTextContent('212.0000')
  })

  it('same unit conversion returns same value', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText('To'), 'm')
    await user.type(screen.getByLabelText('Value'), '42')
    await user.click(screen.getByRole('button', { name: 'Convert' }))
    expect(screen.getByTestId('result')).toHaveTextContent('42.0000')
  })

  it('switching tab clears the result', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Value'), '1')
    await user.click(screen.getByRole('button', { name: 'Convert' }))
    expect(screen.getByTestId('result')).not.toHaveTextContent('')
    await user.click(screen.getByRole('tab', { name: 'Weight' }))
    expect(screen.getByTestId('result')).toHaveTextContent('')
  })
})
