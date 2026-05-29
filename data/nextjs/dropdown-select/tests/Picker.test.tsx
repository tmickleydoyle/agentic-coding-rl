import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Picker from '../components/Picker'

describe('Picker', () => {
  it('defaults to the first option', () => {
    render(<Picker options={['red', 'green', 'blue']} />)
    expect(screen.getByTestId('picked')).toHaveTextContent('red')
    expect((screen.getByTestId('select') as HTMLSelectElement).value).toBe('red')
  })

  it('renders one <option> per item', () => {
    render(<Picker options={['x', 'y', 'z']} />)
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('updates picked when the selection changes', async () => {
    const user = userEvent.setup()
    render(<Picker options={['red', 'green', 'blue']} />)
    await user.selectOptions(screen.getByTestId('select'), 'blue')
    expect(screen.getByTestId('picked')).toHaveTextContent('blue')
  })
})
