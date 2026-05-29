import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tabs from '../components/Tabs'

const sample = [
  { label: 'Overview', content: 'overview-text' },
  { label: 'Details', content: 'details-text' },
  { label: 'FAQ', content: 'faq-text' },
]

describe('Tabs', () => {
  it('shows the first tab content by default', () => {
    render(<Tabs tabs={sample} />)
    expect(screen.getByTestId('panel')).toHaveTextContent('overview-text')
  })

  it('marks the first tab as aria-selected=true initially', () => {
    render(<Tabs tabs={sample} />)
    expect(screen.getByTestId('tab-Overview')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('tab-Details')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByTestId('tab-FAQ')).toHaveAttribute('aria-selected', 'false')
  })

  it('switches content when a different tab is clicked', async () => {
    const user = userEvent.setup()
    render(<Tabs tabs={sample} />)
    await user.click(screen.getByTestId('tab-Details'))
    expect(screen.getByTestId('panel')).toHaveTextContent('details-text')
    expect(screen.getByTestId('tab-Details')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByTestId('tab-Overview')).toHaveAttribute('aria-selected', 'false')
  })

  it('switches again, leaving exactly one aria-selected=true', async () => {
    const user = userEvent.setup()
    render(<Tabs tabs={sample} />)
    await user.click(screen.getByTestId('tab-FAQ'))
    expect(screen.getByTestId('panel')).toHaveTextContent('faq-text')
    const selected = sample.filter(
      (t) => screen.getByTestId(`tab-${t.label}`).getAttribute('aria-selected') === 'true'
    )
    expect(selected).toHaveLength(1)
    expect(selected[0].label).toBe('FAQ')
  })

  it('handles an empty tabs array gracefully', () => {
    render(<Tabs tabs={[]} />)
    expect(screen.getByTestId('panel')).toHaveTextContent('')
  })
})
