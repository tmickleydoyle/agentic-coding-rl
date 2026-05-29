import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Accordion from '../components/Accordion'

const PANELS = [
  { title: 'First',  body: 'body1' },
  { title: 'Second', body: 'body2' },
  { title: 'Third',  body: 'body3' },
]

describe('Accordion', () => {
  it('starts with all panels collapsed', () => {
    render(<Accordion panels={PANELS} />)
    for (let i = 0; i < 3; i++) {
      expect(screen.getByTestId(`header-${i}`)).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByTestId(`body-${i}`)).toBeNull()
    }
  })

  it('expands a panel on click', async () => {
    const user = userEvent.setup()
    render(<Accordion panels={PANELS} />)
    await user.click(screen.getByTestId('header-1'))
    expect(screen.getByTestId('header-1')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTestId('body-1')).toHaveTextContent('body2')
  })

  it('panels expand independently — both can be open', async () => {
    const user = userEvent.setup()
    render(<Accordion panels={PANELS} />)
    await user.click(screen.getByTestId('header-0'))
    await user.click(screen.getByTestId('header-2'))
    expect(screen.getByTestId('body-0')).toBeInTheDocument()
    expect(screen.queryByTestId('body-1')).toBeNull()
    expect(screen.getByTestId('body-2')).toBeInTheDocument()
  })

  it('collapses on second click', async () => {
    const user = userEvent.setup()
    render(<Accordion panels={PANELS} />)
    const h = screen.getByTestId('header-0')
    await user.click(h)
    await user.click(h)
    expect(h).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByTestId('body-0')).toBeNull()
  })
})
