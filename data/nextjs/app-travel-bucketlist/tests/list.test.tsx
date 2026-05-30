import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('list grouping and counts', () => {
  it('shows total/visited/remaining counts from seed', () => {
    render(<App />)
    // 5 total, 2 visited (Kyoto, Cairo), 3 remaining
    expect(screen.getByTestId('count-total')).toHaveTextContent('5')
    expect(screen.getByTestId('count-visited')).toHaveTextContent('2')
    expect(screen.getByTestId('count-remaining')).toHaveTextContent('3')
  })

  it('groups destinations by continent', () => {
    render(<App />)
    expect(screen.getByTestId('group-Asia')).toBeInTheDocument()
    expect(screen.getByTestId('group-Europe')).toBeInTheDocument()
    expect(screen.getByTestId('group-Europe-count')).toHaveTextContent('2')
    expect(screen.getByTestId('group-Asia-count')).toHaveTextContent('1')
  })

  it('places each destination in its continent group', () => {
    render(<App />)
    const europe = screen.getByTestId('group-Europe-list')
    expect(within(europe).getByTestId('dest-d3')).toBeInTheDocument()
    expect(within(europe).getByTestId('dest-d5')).toBeInTheDocument()
    expect(within(europe).queryByTestId('dest-d1')).not.toBeInTheDocument()
  })

  it('marks visited state on cards', () => {
    render(<App />)
    expect(screen.getByTestId('dest-d1')).toHaveAttribute('data-visited', 'true')
    expect(screen.getByTestId('dest-d2')).toHaveAttribute('data-visited', 'false')
  })

  it('filters by continent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('continent-filter'), 'Europe')
    expect(screen.getByTestId('group-Europe')).toBeInTheDocument()
    expect(screen.queryByTestId('group-Asia')).not.toBeInTheDocument()
    expect(screen.getByTestId('count-total')).toHaveTextContent('2')
  })

  it('toggles visited from a card and updates counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('toggle-d2')) // mark Patagonia visited
    expect(screen.getByTestId('dest-d2')).toHaveAttribute('data-visited', 'true')
    expect(screen.getByTestId('count-visited')).toHaveTextContent('3')
    expect(screen.getByTestId('count-remaining')).toHaveTextContent('2')
  })
})
