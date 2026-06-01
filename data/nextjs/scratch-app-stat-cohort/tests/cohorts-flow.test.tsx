import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('cohorts flow', () => {
  it('lists all cohorts with month, size and M3 retention', () => {
    render(<App />)
    const list = screen.getByTestId('cohort-list')
    expect(within(list).getByTestId('cohort-c1-month')).toHaveTextContent('Jan')
    expect(within(list).getByTestId('cohort-c1-size')).toHaveTextContent('200')
    expect(within(list).getByTestId('cohort-c1-m3')).toHaveTextContent('20')
    expect(within(list).getByTestId('cohort-c4-m3')).toHaveTextContent('40')
  })

  it('filters to large cohorts (size >= 100)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('size-filter'), 'large')
    expect(screen.getByTestId('cohort-c1')).toBeInTheDocument()
    expect(screen.getByTestId('cohort-c2')).toBeInTheDocument()
    expect(screen.getByTestId('cohort-c3')).toBeInTheDocument()
    // Apr (50) is excluded
    expect(screen.queryByTestId('cohort-c4')).not.toBeInTheDocument()
  })

  it('selecting a cohort navigates to retention and shows its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-c2'))
    expect(screen.getByTestId('page-retention')).toBeInTheDocument()
    expect(screen.getByTestId('detail-month')).toHaveTextContent('Feb')
  })
})
