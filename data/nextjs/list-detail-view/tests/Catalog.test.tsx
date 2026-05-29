import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Catalog from '../components/Catalog'

const ITEMS = [
  { id: 'a', title: 'Apple',  body: 'red fruit' },
  { id: 'b', title: 'Banana', body: 'yellow fruit' },
  { id: 'c', title: 'Cherry', body: 'small red' },
]

describe('Catalog', () => {
  it('shows the list initially; no detail testids', () => {
    render(<Catalog items={ITEMS} />)
    expect(screen.getByTestId('list')).toBeInTheDocument()
    expect(screen.getByTestId('row-a')).toHaveTextContent('Apple')
    expect(screen.queryByTestId('title')).toBeNull()
    expect(screen.queryByTestId('body')).toBeNull()
    expect(screen.queryByTestId('back')).toBeNull()
  })

  it('clicking a row opens the detail; list hides', async () => {
    const user = userEvent.setup()
    render(<Catalog items={ITEMS} />)
    await user.click(screen.getByTestId('row-b'))
    expect(screen.queryByTestId('list')).toBeNull()
    expect(screen.getByTestId('title')).toHaveTextContent('Banana')
    expect(screen.getByTestId('body')).toHaveTextContent('yellow fruit')
    expect(screen.getByTestId('back')).toBeInTheDocument()
  })

  it('Back returns to the list', async () => {
    const user = userEvent.setup()
    render(<Catalog items={ITEMS} />)
    await user.click(screen.getByTestId('row-a'))
    await user.click(screen.getByTestId('back'))
    expect(screen.getByTestId('list')).toBeInTheDocument()
    expect(screen.queryByTestId('title')).toBeNull()
  })

  it('opening a different row swaps detail content', async () => {
    const user = userEvent.setup()
    render(<Catalog items={ITEMS} />)
    await user.click(screen.getByTestId('row-a'))
    await user.click(screen.getByTestId('back'))
    await user.click(screen.getByTestId('row-c'))
    expect(screen.getByTestId('title')).toHaveTextContent('Cherry')
    expect(screen.getByTestId('body')).toHaveTextContent('small red')
  })
})
