import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MultiSelect from '../components/MultiSelect'

const OPTIONS = [
  { id: 'r', label: 'Red' },
  { id: 'g', label: 'Green' },
  { id: 'b', label: 'Blue' },
]

function dropdownValues(): string[] {
  const sel = screen.getByTestId('dropdown') as HTMLSelectElement
  return Array.from(sel.options).map((o) => o.value)
}

describe('MultiSelect chips', () => {
  it('starts with no chips and all options in the dropdown', () => {
    render(<MultiSelect options={OPTIONS} />)
    expect(within(screen.getByTestId('chips')).queryAllByTestId(/^chip-/)).toHaveLength(0)
    expect(dropdownValues()).toEqual(['', 'r', 'g', 'b'])
  })

  it('selecting an option adds a chip', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} />)
    await user.selectOptions(screen.getByTestId('dropdown'), 'g')
    expect(screen.getByTestId('chip-g')).toHaveTextContent('Green')
  })

  it('selected options disappear from the dropdown', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} />)
    await user.selectOptions(screen.getByTestId('dropdown'), 'r')
    expect(dropdownValues()).toEqual(['', 'g', 'b'])
  })

  it('chips appear in selection order', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} />)
    await user.selectOptions(screen.getByTestId('dropdown'), 'b')
    await user.selectOptions(screen.getByTestId('dropdown'), 'r')
    const ids = within(screen.getByTestId('chips'))
      .getAllByTestId(/^chip-/)
      .map((el) => el.getAttribute('data-testid'))
    expect(ids).toEqual(['chip-b', 'chip-r'])
  })

  it('removing a chip deselects and returns the option to the dropdown', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} />)
    await user.selectOptions(screen.getByTestId('dropdown'), 'g')
    expect(dropdownValues()).toEqual(['', 'r', 'b'])
    await user.click(screen.getByTestId('remove-g'))
    expect(screen.queryByTestId('chip-g')).toBeNull()
    expect(dropdownValues()).toEqual(['', 'r', 'g', 'b'])
  })

  it('when all options selected the dropdown shows only the placeholder', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} />)
    await user.selectOptions(screen.getByTestId('dropdown'), 'r')
    await user.selectOptions(screen.getByTestId('dropdown'), 'g')
    await user.selectOptions(screen.getByTestId('dropdown'), 'b')
    expect(dropdownValues()).toEqual([''])
    expect(within(screen.getByTestId('chips')).getAllByTestId(/^chip-/)).toHaveLength(3)
  })
})
