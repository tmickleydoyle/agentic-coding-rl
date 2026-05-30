import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('grocery rollup', () => {
  it('rolls up ingredients from all seeded assignments', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-grocery'))
    // Oatmeal + Veggie Stir Fry both assigned on Mon
    expect(screen.getByTestId('grocery-oats')).toBeInTheDocument()
    expect(screen.getByTestId('grocery-rice')).toBeInTheDocument()
    expect(screen.getByTestId('grocery-broccoli')).toBeInTheDocument()
  })

  it('counts each ingredient once per assignment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-grocery'))
    // only Veggie Stir Fry uses garlic so far -> count 1
    expect(screen.getByTestId('grocery-garlic-count')).toHaveTextContent('1')
    expect(screen.getByTestId('grocery-oats-count')).toHaveTextContent('1')
  })

  it('increments duplicate ingredient counts after assigning another recipe', async () => {
    const user = userEvent.setup()
    render(<App />)
    // assign Caesar Salad (also has garlic) to Tuesday
    await user.click(screen.getByTestId('open-Tue'))
    await user.selectOptions(screen.getByTestId('assign-select'), 'r3')
    await user.click(screen.getByTestId('assign-button'))
    await user.click(screen.getByTestId('nav-grocery'))
    expect(screen.getByTestId('grocery-garlic-count')).toHaveTextContent('2')
  })

  it('shows the grocery empty state when nothing is assigned', async () => {
    const user = userEvent.setup()
    render(<App />)
    // remove both Monday assignments
    await user.click(screen.getByTestId('open-Mon'))
    await user.click(screen.getByTestId('remove-a1'))
    await user.click(screen.getByTestId('remove-a2'))
    await user.click(screen.getByTestId('nav-grocery'))
    expect(screen.getByTestId('grocery-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('grocery-list')).not.toBeInTheDocument()
  })
})
