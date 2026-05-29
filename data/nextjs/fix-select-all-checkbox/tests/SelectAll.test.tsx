import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectAll from '../components/SelectAll'

describe('SelectAll', () => {
  it('starts with nothing selected and header unchecked', () => {
    render(<SelectAll />)
    const header = screen.getByTestId('select-all') as HTMLInputElement
    expect(header.checked).toBe(false)
    expect(header.indeterminate).toBe(false)
    expect(screen.getByTestId('row-1')).not.toBeChecked()
  })

  it('select all checks every row', async () => {
    const user = userEvent.setup()
    render(<SelectAll />)
    await user.click(screen.getByTestId('select-all'))
    expect(screen.getByTestId('row-1')).toBeChecked()
    expect(screen.getByTestId('row-2')).toBeChecked()
    expect(screen.getByTestId('row-3')).toBeChecked()
    const header = screen.getByTestId('select-all') as HTMLInputElement
    expect(header.checked).toBe(true)
    expect(header.indeterminate).toBe(false)
  })

  it('unchecking one row after select-all makes header indeterminate, not checked', async () => {
    const user = userEvent.setup()
    render(<SelectAll />)
    await user.click(screen.getByTestId('select-all'))
    await user.click(screen.getByTestId('row-2'))
    const header = screen.getByTestId('select-all') as HTMLInputElement
    expect(header.checked).toBe(false)
    expect(header.indeterminate).toBe(true)
  })

  it('selecting some rows manually makes the header indeterminate', async () => {
    const user = userEvent.setup()
    render(<SelectAll />)
    await user.click(screen.getByTestId('row-1'))
    const header = screen.getByTestId('select-all') as HTMLInputElement
    expect(header.checked).toBe(false)
    expect(header.indeterminate).toBe(true)
  })

  it('selecting all rows manually makes the header checked and not indeterminate', async () => {
    const user = userEvent.setup()
    render(<SelectAll />)
    await user.click(screen.getByTestId('row-1'))
    await user.click(screen.getByTestId('row-2'))
    await user.click(screen.getByTestId('row-3'))
    const header = screen.getByTestId('select-all') as HTMLInputElement
    expect(header.checked).toBe(true)
    expect(header.indeterminate).toBe(false)
  })

  it('clicking header again after partial selection clears all rows', async () => {
    const user = userEvent.setup()
    render(<SelectAll />)
    await user.click(screen.getByTestId('select-all'))
    await user.click(screen.getByTestId('row-2'))
    // header is indeterminate; clicking it should select all (toggleAll: next = !allChecked = true)
    await user.click(screen.getByTestId('select-all'))
    expect(screen.getByTestId('row-1')).toBeChecked()
    expect(screen.getByTestId('row-2')).toBeChecked()
    expect(screen.getByTestId('row-3')).toBeChecked()
  })
})
