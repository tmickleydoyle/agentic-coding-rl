import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('board', () => {
  it('places issues in their status columns', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    const open = screen.getByTestId('col-open')
    expect(within(open).getByTestId('card-i1')).toBeInTheDocument()
    expect(within(open).getByTestId('card-i3')).toBeInTheDocument()
    expect(within(screen.getByTestId('col-in-progress')).getByTestId('card-i2')).toBeInTheDocument()
    expect(within(screen.getByTestId('col-closed')).getByTestId('card-i4')).toBeInTheDocument()
  })

  it('shows column counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('col-open-count')).toHaveTextContent('2')
    expect(screen.getByTestId('col-in-progress-count')).toHaveTextContent('1')
    expect(screen.getByTestId('col-closed-count')).toHaveTextContent('1')
  })

  it('advances an issue from open to in-progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    await user.click(screen.getByTestId('next-i1'))
    expect(within(screen.getByTestId('col-in-progress')).getByTestId('card-i1')).toBeInTheDocument()
    expect(screen.getByTestId('col-open-count')).toHaveTextContent('1')
    expect(screen.getByTestId('col-in-progress-count')).toHaveTextContent('2')
  })

  it('advances an issue all the way to closed and stays there', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    await user.click(screen.getByTestId('next-i3')) // open -> in-progress
    await user.click(screen.getByTestId('next-i3')) // in-progress -> closed
    expect(within(screen.getByTestId('col-closed')).getByTestId('card-i3')).toBeInTheDocument()
    await user.click(screen.getByTestId('next-i3')) // stays closed
    expect(within(screen.getByTestId('col-closed')).getByTestId('card-i3')).toBeInTheDocument()
    expect(screen.getByTestId('col-closed-count')).toHaveTextContent('2')
  })
})

describe('theme', () => {
  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
