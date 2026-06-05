import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('clients page', () => {
  it('lists seeded clients with name and email', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-clients'))
    expect(screen.getByTestId('client-c1-name')).toHaveTextContent('Acme Co')
    expect(screen.getByTestId('client-c1-email')).toHaveTextContent('billing@acme.test')
    expect(screen.getByTestId('client-c2-name')).toHaveTextContent('Globex')
  })

  it('shows outstanding totals per client from seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-clients'))
    // c1 has sent 1200 (unpaid); c2 has paid 800 (0 outstanding); c3 has overdue 450
    expect(screen.getByTestId('client-c1-outstanding')).toHaveTextContent('1200')
    expect(screen.getByTestId('client-c2-outstanding')).toHaveTextContent('0')
    expect(screen.getByTestId('client-c3-outstanding')).toHaveTextContent('450')
  })

  it('drops a client outstanding to zero after marking their invoice paid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-invoices'))
    await user.click(screen.getByTestId('mark-paid-i1'))
    await user.click(screen.getByTestId('nav-clients'))
    expect(screen.getByTestId('client-c1-outstanding')).toHaveTextContent('0')
  })
})
