import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BreadcrumbNav from '../components/BreadcrumbNav'

const crumbTexts = () =>
  within(screen.getByTestId('crumbs'))
    .getAllByRole('button')
    .map((b) => b.textContent)

describe('BreadcrumbNav', () => {
  it('starts with [Home]; current=Home', () => {
    render(<BreadcrumbNav />)
    expect(crumbTexts()).toEqual(['Home'])
    expect(screen.getByTestId('current')).toHaveTextContent('Home')
  })

  it('navigating deeper appends to the path', async () => {
    const user = userEvent.setup()
    render(<BreadcrumbNav />)
    await user.click(screen.getByTestId('go-products'))
    await user.click(screen.getByTestId('go-electronics'))
    await user.click(screen.getByTestId('go-phones'))
    expect(crumbTexts()).toEqual(['Home', 'Products', 'Electronics', 'Phones'])
    expect(screen.getByTestId('current')).toHaveTextContent('Phones')
  })

  it('clicking a crumb truncates back to that level', async () => {
    const user = userEvent.setup()
    render(<BreadcrumbNav />)
    await user.click(screen.getByTestId('go-products'))
    await user.click(screen.getByTestId('go-electronics'))
    await user.click(screen.getByTestId('go-phones'))
    // crumb-1 is "Products" — should drop Electronics + Phones
    await user.click(screen.getByTestId('crumb-1'))
    expect(crumbTexts()).toEqual(['Home', 'Products'])
    expect(screen.getByTestId('current')).toHaveTextContent('Products')
  })

  it('clicking the root crumb returns to [Home]', async () => {
    const user = userEvent.setup()
    render(<BreadcrumbNav />)
    await user.click(screen.getByTestId('go-products'))
    await user.click(screen.getByTestId('go-electronics'))
    await user.click(screen.getByTestId('crumb-0'))
    expect(crumbTexts()).toEqual(['Home'])
    expect(screen.getByTestId('current')).toHaveTextContent('Home')
  })
})
