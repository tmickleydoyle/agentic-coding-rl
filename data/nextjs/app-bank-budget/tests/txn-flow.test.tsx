import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('transaction flow', () => {
  it('lists the seeded transactions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    expect(screen.getByTestId('txn-t1-desc')).toHaveTextContent('Pizza night')
    expect(screen.getByTestId('txn-t3-amount')).toHaveTextContent('540')
  })

  it('blocks submitting with an empty amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    await user.click(screen.getByTestId('submit-txn'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('blocks a non-positive amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.click(screen.getByTestId('submit-txn'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a transaction and updates the category spend', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    await user.selectOptions(screen.getByTestId('category-select'), 'c1')
    await user.type(screen.getByTestId('description-input'), 'Brunch')
    await user.type(screen.getByTestId('amount-input'), '40')
    await user.click(screen.getByTestId('submit-txn'))
    expect(screen.getByTestId('txn-t6-desc')).toHaveTextContent('Brunch')

    await user.click(screen.getByTestId('nav-categories'))
    // c1 was 180, now 220
    expect(screen.getByTestId('category-c1-spent')).toHaveTextContent('220')
  })

  it('removes a transaction and updates the category spend', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    await user.click(screen.getByTestId('txn-t3-remove'))
    expect(screen.queryByTestId('txn-t3')).not.toBeInTheDocument()

    await user.click(screen.getByTestId('nav-categories'))
    // c2 had only t3 (540); removing it drops spent to 0 and clears the over flag
    expect(screen.getByTestId('category-c2-spent')).toHaveTextContent('0')
    expect(screen.getByTestId('category-c2')).toHaveAttribute('data-over', 'false')
  })
})
