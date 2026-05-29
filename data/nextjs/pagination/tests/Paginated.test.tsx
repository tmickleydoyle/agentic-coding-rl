import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Paginated from '../components/Paginated'

const mkItems = (n: number) => Array.from({ length: n }, (_, i) => `item-${i + 1}`)

describe('Paginated', () => {
  it('shows first 5 items on page 1 of 3 for 12 items', () => {
    render(<Paginated items={mkItems(12)} />)
    expect(screen.getByTestId('indicator')).toHaveTextContent('Page 1 of 3')
    const lis = within(screen.getByTestId('page')).getAllByRole('listitem').map((li) => li.textContent)
    expect(lis).toEqual(['item-1', 'item-2', 'item-3', 'item-4', 'item-5'])
  })

  it('prev is disabled and next is enabled on page 1', () => {
    render(<Paginated items={mkItems(12)} />)
    expect(screen.getByTestId('prev')).toBeDisabled()
    expect(screen.getByTestId('next')).not.toBeDisabled()
  })

  it('Next advances to page 2', async () => {
    const user = userEvent.setup()
    render(<Paginated items={mkItems(12)} />)
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('indicator')).toHaveTextContent('Page 2 of 3')
    const lis = within(screen.getByTestId('page')).getAllByRole('listitem').map((li) => li.textContent)
    expect(lis).toEqual(['item-6', 'item-7', 'item-8', 'item-9', 'item-10'])
  })

  it('disables next on the last page; partial page renders remaining items only', async () => {
    const user = userEvent.setup()
    render(<Paginated items={mkItems(12)} />)
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('indicator')).toHaveTextContent('Page 3 of 3')
    expect(screen.getByTestId('next')).toBeDisabled()
    expect(screen.getByTestId('prev')).not.toBeDisabled()
    const lis = within(screen.getByTestId('page')).getAllByRole('listitem').map((li) => li.textContent)
    expect(lis).toEqual(['item-11', 'item-12'])
  })

  it('handles an empty array gracefully', () => {
    render(<Paginated items={[]} />)
    expect(screen.getByTestId('indicator')).toHaveTextContent('Page 1 of 1')
    expect(within(screen.getByTestId('page')).queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByTestId('prev')).toBeDisabled()
    expect(screen.getByTestId('next')).toBeDisabled()
  })
})
