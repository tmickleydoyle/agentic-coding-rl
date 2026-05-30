import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('forecast and contacts', () => {
  it('computes win rate from won and lost deals', async () => {
    const user = userEvent.setup()
    render(<App />)
    // seed: 1 won, 0 lost -> 100%
    await user.click(screen.getByTestId('nav-forecast'))
    expect(screen.getByTestId('win-rate')).toHaveTextContent('100')
  })

  it('shows open value of non-closed deals', async () => {
    const user = userEvent.setup()
    render(<App />)
    // open = qualified 5000 + proposal 12000 + lead 3000 = 20000
    await user.click(screen.getByTestId('nav-forecast'))
    expect(screen.getByTestId('open-value')).toHaveTextContent('20000')
  })

  it('lists per-stage forecast rows with counts and values', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-forecast'))
    expect(screen.getByTestId('forecast-won-count')).toHaveTextContent('1')
    expect(screen.getByTestId('forecast-won-value')).toHaveTextContent('8000')
    expect(screen.getByTestId('forecast-lead-value')).toHaveTextContent('3000')
  })

  it('win rate recomputes after a deal is lost', async () => {
    const user = userEvent.setup()
    render(<App />)
    // mark d1 lost -> won 1, lost 1 -> 50%
    await user.click(screen.getByTestId('open-d1'))
    await user.selectOptions(screen.getByTestId('detail-stage-select'), 'lost')
    await user.click(screen.getByTestId('nav-forecast'))
    expect(screen.getByTestId('win-rate')).toHaveTextContent('50')
  })

  it('lists contacts with their company and deal counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-contacts'))
    expect(screen.getByTestId('contact-c1-name')).toHaveTextContent('Ada Byron')
    expect(screen.getByTestId('contact-c1-company')).toHaveTextContent('Analytical')
    expect(screen.getByTestId('contact-c1-deals')).toHaveTextContent('2')
    expect(screen.getByTestId('contact-c2-deals')).toHaveTextContent('1')
  })
})
