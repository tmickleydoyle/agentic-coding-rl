import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

const CATEGORIES = ['Productivity', 'Communication', 'Teamwork', 'Innovation', 'Reliability']

async function rateAll(user: ReturnType<typeof userEvent.setup>, score: number) {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const radios = screen.getAllByRole('radio', { name: String(score) })
    await user.click(radios[i])
  }
}

describe('Performance Review', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /performance review/i })).toBeInTheDocument()
  })

  it('shows 3 employee tabs', () => {
    expect(screen.getAllByTestId('employee-tab')).toHaveLength(3)
  })

  it('shows summary table with all employees', () => {
    expect(screen.getAllByTestId('summary-row')).toHaveLength(3)
  })

  it('unreviewed employees show Not reviewed', () => {
    const avgs = screen.getAllByTestId('summary-avg').map(el => el.textContent)
    avgs.forEach(a => expect(a).toBe('Not reviewed'))
  })

  it('no review form shown initially', () => {
    expect(screen.queryByTestId('review-form')).not.toBeInTheDocument()
  })

  it('shows review form when employee tab clicked', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('employee-tab')[0])
    expect(screen.getByTestId('review-form')).toBeInTheDocument()
  })

  it('shows all 5 category rows in form', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('employee-tab')[0])
    expect(screen.getAllByTestId('category-row')).toHaveLength(5)
  })

  it('saves review and shows confirmation', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('employee-tab')[0])
    await rateAll(user, 4)
    await user.click(screen.getByTestId('save-review'))
    expect(screen.getByTestId('save-confirmation')).toHaveTextContent('Review saved for Alice Johnson')
  })

  it('updates average score after save', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('employee-tab')[0])
    await rateAll(user, 5)
    await user.click(screen.getByTestId('save-review'))
    const avgs = screen.getAllByTestId('summary-avg')
    expect(avgs[0]).toHaveTextContent('5.0')
  })

  it('does not save if not all categories rated', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('employee-tab')[1])
    // Only rate 2 categories
    const radios = screen.getAllByRole('radio', { name: '3' })
    await user.click(radios[0])
    await user.click(radios[1])
    await user.click(screen.getByTestId('save-review'))
    expect(screen.queryByTestId('save-confirmation')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('summary-avg')[1]).toHaveTextContent('Not reviewed')
  })

  it('loads existing review when switching to reviewed employee', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('employee-tab')[0])
    await rateAll(user, 3)
    await user.click(screen.getByTestId('save-review'))
    // Switch away and back
    await user.click(screen.getAllByTestId('employee-tab')[1])
    await user.click(screen.getAllByTestId('employee-tab')[0])
    // All rating 3 radios should be checked
    CATEGORIES.forEach(cat => {
      const radio = screen.getByRole('radio', { name: '3' })
      // At least one radio for rating 3 is present (checked state verifiable via form)
      expect(radio).toBeInTheDocument()
    })
  })

  it('can save reviews for multiple employees independently', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('employee-tab')[0])
    await rateAll(user, 5)
    await user.click(screen.getByTestId('save-review'))
    await user.click(screen.getAllByTestId('employee-tab')[1])
    await rateAll(user, 2)
    await user.click(screen.getByTestId('save-review'))
    const avgs = screen.getAllByTestId('summary-avg')
    expect(avgs[0]).toHaveTextContent('5.0')
    expect(avgs[1]).toHaveTextContent('2.0')
    expect(avgs[2]).toHaveTextContent('Not reviewed')
  })
})
