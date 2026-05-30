import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('qualify worklist and converted view', () => {
  it('lists only new leads on the qualify page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-qualify'))
    const list = screen.getByTestId('qualify-list')
    expect(within(list).getByTestId('qualify-l1')).toBeInTheDocument()
    expect(within(list).getByTestId('qualify-l3')).toBeInTheDocument()
    expect(within(list).queryByTestId('qualify-l2')).not.toBeInTheDocument()
  })

  it('shows the average score across all leads', async () => {
    const user = userEvent.setup()
    render(<App />)
    // (80+60+30+90)/4 = 65
    await user.click(screen.getByTestId('nav-qualify'))
    expect(screen.getByTestId('avg-score')).toHaveTextContent('65')
  })

  it('bumps a lead score by 10', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-qualify'))
    await user.click(screen.getByTestId('bump-l3'))
    expect(screen.getByTestId('qualify-l3-score')).toHaveTextContent('40')
  })

  it('qualifying a lead removes it from the worklist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-qualify'))
    await user.click(screen.getByTestId('qualify-btn-l1'))
    expect(screen.queryByTestId('qualify-l1')).not.toBeInTheDocument()
    expect(screen.getByTestId('qualify-l3')).toBeInTheDocument()
  })

  it('shows the seeded converted deal with its value', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-converted'))
    expect(screen.getByTestId('converted-count')).toHaveTextContent('1')
    expect(screen.getByTestId('converted-total')).toHaveTextContent('5000')
    expect(screen.getByTestId('converted-d1-lead')).toHaveTextContent('Margaret H')
  })

  it('converting a lead creates a deal and appears under converted', async () => {
    const user = userEvent.setup()
    render(<App />)
    // qualify l1 first (must not be new for convert? convert allowed on new/qualified)
    await user.click(screen.getByTestId('open-l1'))
    await user.click(screen.getByTestId('detail-convert'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('converted')
    // deal value = score(80) * 100 = 8000
    expect(screen.getByTestId('detail-deal-value')).toHaveTextContent('8000')
    await user.click(screen.getByTestId('nav-converted'))
    expect(screen.getByTestId('converted-count')).toHaveTextContent('2')
    expect(screen.getByTestId('converted-total')).toHaveTextContent('13000')
    expect(screen.getByTestId('converted-d2-lead')).toHaveTextContent('Ada Byron')
  })

  it('a converted lead is filtered into the converted status on the leads page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-l1'))
    await user.click(screen.getByTestId('detail-convert'))
    await user.click(screen.getByTestId('nav-leads'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'converted')
    const list = screen.getByTestId('lead-list')
    expect(within(list).getByTestId('lead-l1')).toBeInTheDocument()
    expect(within(list).getByTestId('lead-l4')).toBeInTheDocument()
  })
})
