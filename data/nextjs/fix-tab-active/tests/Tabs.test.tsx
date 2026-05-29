import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tabs from '../components/Tabs'

describe('Tabs', () => {
  it('starts with the first tab active', () => {
    render(<Tabs />)
    expect(screen.getByTestId('tab-Home')).toHaveClass('active')
    expect(screen.getByTestId('panel')).toHaveTextContent('Content: Home')
  })

  it('switches active tab on click', async () => {
    const user = userEvent.setup()
    render(<Tabs />)
    await user.click(screen.getByTestId('tab-Settings'))
    expect(screen.getByTestId('tab-Settings')).toHaveClass('active')
    expect(screen.getByTestId('panel')).toHaveTextContent('Content: Settings')
  })

  it('closing the active middle tab activates its left neighbor', async () => {
    const user = userEvent.setup()
    render(<Tabs />)
    await user.click(screen.getByTestId('tab-Profile'))
    await user.click(screen.getByTestId('close-Profile'))
    expect(screen.queryByTestId('tab-Profile')).toBeNull()
    expect(screen.getByTestId('tab-Home')).toHaveClass('active')
    expect(screen.getByTestId('panel')).toHaveTextContent('Content: Home')
  })

  it('closing the active first tab activates the new first tab', async () => {
    const user = userEvent.setup()
    render(<Tabs />)
    await user.click(screen.getByTestId('close-Home'))
    expect(screen.getByTestId('tab-Profile')).toHaveClass('active')
    expect(screen.getByTestId('panel')).toHaveTextContent('Content: Profile')
  })

  it('closing a non-active tab keeps the active tab active', async () => {
    const user = userEvent.setup()
    render(<Tabs />)
    await user.click(screen.getByTestId('tab-Settings'))
    await user.click(screen.getByTestId('close-Home'))
    expect(screen.getByTestId('tab-Settings')).toHaveClass('active')
    expect(screen.getByTestId('panel')).toHaveTextContent('Content: Settings')
  })
})
