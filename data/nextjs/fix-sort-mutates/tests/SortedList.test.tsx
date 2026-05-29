import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SortedList from '../components/SortedList'
import SortDemo from '../components/SortDemo'

describe('SortedList', () => {
  it('renders the rows unsorted before clicking Sort', () => {
    render(<SortedList rows={[3, 1, 2]} />)
    expect(screen.getByTestId('sorted')).toHaveTextContent('3, 1, 2')
  })

  it('sorts ascending on click', async () => {
    const user = userEvent.setup()
    render(<SortedList rows={[3, 1, 2]} />)
    await user.click(screen.getByTestId('sort'))
    expect(screen.getByTestId('sorted')).toHaveTextContent('1, 2, 3')
  })

  it('does not mutate the array passed in', async () => {
    const user = userEvent.setup()
    const input = [3, 1, 2]
    render(<SortedList rows={input} />)
    await user.click(screen.getByTestId('sort'))
    expect(input).toEqual([3, 1, 2])
  })

  it('does not change the harness original display after sorting', async () => {
    const user = userEvent.setup()
    render(<SortDemo />)
    await user.click(screen.getByTestId('sort'))
    expect(screen.getByTestId('original')).toHaveTextContent('3, 1, 2')
    expect(screen.getByTestId('sorted')).toHaveTextContent('1, 2, 3')
  })

  it('sorting twice still leaves the original untouched', async () => {
    const user = userEvent.setup()
    render(<SortDemo />)
    await user.click(screen.getByTestId('sort'))
    await user.click(screen.getByTestId('sort'))
    expect(screen.getByTestId('original')).toHaveTextContent('3, 1, 2')
  })
})
