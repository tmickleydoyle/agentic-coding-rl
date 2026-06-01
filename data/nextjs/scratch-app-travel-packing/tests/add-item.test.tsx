import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add item flow', () => {
  it('blocks submitting an item with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-item'))
    await user.click(screen.getByTestId('submit-item'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-item')).toBeInTheDocument()
  })

  it('adds an item and shows it under its category on the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    await user.click(screen.getByTestId('add-item-link'))
    await user.selectOptions(screen.getByTestId('trip-select'), 'tr1')
    await user.type(screen.getByTestId('name-input'), 'Charger')
    await user.selectOptions(screen.getByTestId('category-select'), 'electronics')
    await user.click(screen.getByTestId('submit-item'))
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    const elec = screen.getByTestId('category-electronics-list')
    expect(within(elec).getByText('Charger')).toBeInTheDocument()
  })

  it('lowers the percent when an unpacked item is added', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    expect(screen.getByTestId('list-percent')).toHaveTextContent('33')
    await user.click(screen.getByTestId('add-item-link'))
    await user.selectOptions(screen.getByTestId('trip-select'), 'tr1')
    await user.type(screen.getByTestId('name-input'), 'Hat')
    await user.click(screen.getByTestId('submit-item'))
    // now 1 of 4 packed = 25
    expect(screen.getByTestId('list-percent')).toHaveTextContent('25')
  })
})
