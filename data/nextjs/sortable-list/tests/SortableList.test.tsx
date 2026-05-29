import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SortableList from '../components/SortableList'

const ITEMS = ['banana', 'apple', 'cherry']

const texts = () =>
  within(screen.getByTestId('list'))
    .getAllByRole('listitem')
    .map((li) => li.textContent)

describe('SortableList', () => {
  it('starts in original order with the right button label', () => {
    render(<SortableList items={ITEMS} />)
    expect(texts()).toEqual(['banana', 'apple', 'cherry'])
    expect(screen.getByTestId('order')).toHaveTextContent('original')
    expect(screen.getByTestId('sort')).toHaveTextContent('Sort A→Z')
  })

  it('first click → ascending', async () => {
    const user = userEvent.setup()
    render(<SortableList items={ITEMS} />)
    await user.click(screen.getByTestId('sort'))
    expect(texts()).toEqual(['apple', 'banana', 'cherry'])
    expect(screen.getByTestId('order')).toHaveTextContent('asc')
    expect(screen.getByTestId('sort')).toHaveTextContent('Sort Z→A')
  })

  it('second click → descending', async () => {
    const user = userEvent.setup()
    render(<SortableList items={ITEMS} />)
    const btn = screen.getByTestId('sort')
    await user.click(btn)
    await user.click(btn)
    expect(texts()).toEqual(['cherry', 'banana', 'apple'])
    expect(screen.getByTestId('order')).toHaveTextContent('desc')
    expect(btn).toHaveTextContent('Original order')
  })

  it('third click → back to original', async () => {
    const user = userEvent.setup()
    render(<SortableList items={ITEMS} />)
    const btn = screen.getByTestId('sort')
    await user.click(btn); await user.click(btn); await user.click(btn)
    expect(texts()).toEqual(['banana', 'apple', 'cherry'])
    expect(screen.getByTestId('order')).toHaveTextContent('original')
    expect(btn).toHaveTextContent('Sort A→Z')
  })
})
