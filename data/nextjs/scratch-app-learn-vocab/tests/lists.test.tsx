import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('lists page', () => {
  it('lists seeded vocab lists with counts and mastered totals', () => {
    render(<App />)
    const list = screen.getByTestId('list-list')
    expect(within(list).getByTestId('list-l1-name')).toHaveTextContent('Spanish')
    expect(within(list).getByTestId('list-l1-count')).toHaveTextContent('3')
    // only l1-w3 (house) is mastered
    expect(within(list).getByTestId('list-l1-mastered')).toHaveTextContent('1')
    expect(within(list).getByTestId('list-l2-count')).toHaveTextContent('1')
    expect(within(list).getByTestId('list-l2-mastered')).toHaveTextContent('0')
  })

  it('opening a list navigates to practice with the first word', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('practice-l1'))
    expect(screen.getByTestId('page-practice')).toBeInTheDocument()
    expect(screen.getByTestId('prompt-term')).toHaveTextContent('dog')
  })
})
