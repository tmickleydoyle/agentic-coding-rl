import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Paginator from '../components/Paginator'

describe('Paginator', () => {
  it('shows the first page and page indicator', () => {
    render(<Paginator />)
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 1 of 3')
    expect(screen.getByTestId('row-1')).toBeInTheDocument()
    expect(screen.getByTestId('row-5')).toBeInTheDocument()
    expect(screen.queryByTestId('row-6')).toBeNull()
  })

  it('disables Prev on the first page', () => {
    render(<Paginator />)
    expect(screen.getByTestId('prev')).toBeDisabled()
  })

  it('navigates to the last page and shows its rows', async () => {
    const user = userEvent.setup()
    render(<Paginator />)
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 3 of 3')
    expect(screen.getByTestId('row-11')).toBeInTheDocument()
    expect(screen.getByTestId('row-12')).toBeInTheDocument()
  })

  it('disables Next on the last page', async () => {
    const user = userEvent.setup()
    render(<Paginator />)
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('next')).toBeDisabled()
  })

  it('cannot page past the last page', async () => {
    const user = userEvent.setup()
    render(<Paginator />)
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('next')) // ignored / disabled
    expect(screen.getByTestId('page-info')).toHaveTextContent('Page 3 of 3')
    expect(screen.getByTestId('row-12')).toBeInTheDocument()
  })
})
