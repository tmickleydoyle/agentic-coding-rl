import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AccordionItem from '../components/AccordionItem'

describe('AccordionItem', () => {
  it('renders the toggle button with title', () => {
    render(<AccordionItem title="FAQ" content="Answer here" />)
    expect(screen.getByTestId('accordion-toggle').textContent).toContain('FAQ')
  })

  it('content is not visible initially', () => {
    render(<AccordionItem title="FAQ" content="Answer here" />)
    expect(screen.queryByTestId('accordion-content')).toBeNull()
  })

  it('shows content after clicking toggle', async () => {
    const user = userEvent.setup()
    render(<AccordionItem title="FAQ" content="Answer here" />)
    await user.click(screen.getByTestId('accordion-toggle'))
    expect(screen.getByTestId('accordion-content').textContent).toContain('Answer here')
  })

  it('shows "-" icon when open', async () => {
    const user = userEvent.setup()
    render(<AccordionItem title="FAQ" content="Answer here" />)
    await user.click(screen.getByTestId('accordion-toggle'))
    expect(screen.getByTestId('accordion-toggle').textContent).toContain('-')
  })

  it('shows "+" icon when closed', () => {
    render(<AccordionItem title="FAQ" content="Answer here" />)
    expect(screen.getByTestId('accordion-toggle').textContent).toContain('+')
  })

  it('hides content after toggling twice', async () => {
    const user = userEvent.setup()
    render(<AccordionItem title="FAQ" content="Answer here" />)
    await user.click(screen.getByTestId('accordion-toggle'))
    await user.click(screen.getByTestId('accordion-toggle'))
    expect(screen.queryByTestId('accordion-content')).toBeNull()
  })
})
