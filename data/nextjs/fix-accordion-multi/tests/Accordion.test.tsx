import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Accordion from '../components/Accordion'

describe('Accordion', () => {
  it('starts with all panels closed', () => {
    render(<Accordion />)
    expect(screen.queryByTestId('body-Alpha')).toBeNull()
    expect(screen.queryByTestId('body-Beta')).toBeNull()
    expect(screen.queryByTestId('body-Gamma')).toBeNull()
  })

  it('opens a panel on header click', async () => {
    const user = userEvent.setup()
    render(<Accordion />)
    await user.click(screen.getByTestId('header-Alpha'))
    expect(screen.getByTestId('body-Alpha')).toBeInTheDocument()
  })

  it('keeps an earlier panel open when a second is opened', async () => {
    const user = userEvent.setup()
    render(<Accordion />)
    await user.click(screen.getByTestId('header-Alpha'))
    await user.click(screen.getByTestId('header-Beta'))
    expect(screen.getByTestId('body-Alpha')).toBeInTheDocument()
    expect(screen.getByTestId('body-Beta')).toBeInTheDocument()
  })

  it('can have all three open at once', async () => {
    const user = userEvent.setup()
    render(<Accordion />)
    await user.click(screen.getByTestId('header-Alpha'))
    await user.click(screen.getByTestId('header-Beta'))
    await user.click(screen.getByTestId('header-Gamma'))
    expect(screen.getByTestId('body-Alpha')).toBeInTheDocument()
    expect(screen.getByTestId('body-Beta')).toBeInTheDocument()
    expect(screen.getByTestId('body-Gamma')).toBeInTheDocument()
  })

  it('toggling a panel closes only that panel', async () => {
    const user = userEvent.setup()
    render(<Accordion />)
    await user.click(screen.getByTestId('header-Alpha'))
    await user.click(screen.getByTestId('header-Beta'))
    await user.click(screen.getByTestId('header-Alpha'))
    expect(screen.queryByTestId('body-Alpha')).toBeNull()
    expect(screen.getByTestId('body-Beta')).toBeInTheDocument()
  })
})
