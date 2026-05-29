import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Autocomplete from '../components/Autocomplete'

const OPTIONS = ['Apple', 'Apricot', 'Banana', 'Cherry', 'Grape']

describe('Autocomplete', () => {
  it('shows no suggestion list before typing', () => {
    render(<Autocomplete options={OPTIONS} />)
    expect(screen.queryByTestId('suggestions')).toBeNull()
  })

  it('filters by case-insensitive substring', async () => {
    const user = userEvent.setup()
    render(<Autocomplete options={OPTIONS} />)
    await user.type(screen.getByTestId('query'), 'ap')
    const list = screen.getByTestId('suggestions')
    const texts = within(list).getAllByRole('button').map((b) => b.textContent)
    expect(texts).toEqual(['Apple', 'Apricot', 'Grape'])
  })

  it('matches in original option order regardless of input case', async () => {
    const user = userEvent.setup()
    render(<Autocomplete options={OPTIONS} />)
    await user.type(screen.getByTestId('query'), 'AP')
    expect(screen.getByTestId('suggestion-0')).toHaveTextContent('Apple')
    expect(screen.getByTestId('suggestion-1')).toHaveTextContent('Apricot')
    expect(screen.getByTestId('suggestion-2')).toHaveTextContent('Grape')
  })

  it('hides the list when the input is cleared', async () => {
    const user = userEvent.setup()
    render(<Autocomplete options={OPTIONS} />)
    const input = screen.getByTestId('query')
    await user.type(input, 'ba')
    expect(screen.getByTestId('suggestions')).toBeInTheDocument()
    await user.clear(input)
    expect(screen.queryByTestId('suggestions')).toBeNull()
  })

  it('clicking a suggestion fills the input and hides the list', async () => {
    const user = userEvent.setup()
    render(<Autocomplete options={OPTIONS} />)
    const input = screen.getByTestId('query') as HTMLInputElement
    await user.type(input, 'ba')
    await user.click(screen.getByTestId('suggestion-0'))
    expect(input.value).toBe('Banana')
    expect(screen.queryByTestId('suggestions')).toBeNull()
  })

  it('shows the list again after typing post-selection', async () => {
    const user = userEvent.setup()
    render(<Autocomplete options={OPTIONS} />)
    const input = screen.getByTestId('query')
    await user.type(input, 'ch')
    await user.click(screen.getByTestId('suggestion-0'))
    expect(screen.queryByTestId('suggestions')).toBeNull()
    await user.type(input, 'x')
    // "Cherryx" matches nothing -> still no list
    expect(screen.queryByTestId('suggestions')).toBeNull()
    await user.clear(input)
    await user.type(input, 'gr')
    expect(screen.getByTestId('suggestion-0')).toHaveTextContent('Grape')
  })

  it('shows no list when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Autocomplete options={OPTIONS} />)
    await user.type(screen.getByTestId('query'), 'zzz')
    expect(screen.queryByTestId('suggestions')).toBeNull()
  })
})
