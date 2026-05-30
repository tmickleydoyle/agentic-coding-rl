import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('detail flow', () => {
  it('views a listing detail via the view button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-l1'))
    expect(screen.getByTestId('page-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('iPhone 12')
    expect(screen.getByTestId('detail-seller')).toHaveTextContent('alice')
  })

  it('toggles contact info on the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-l2'))
    expect(screen.queryByTestId('contact-info')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('contact-seller'))
    expect(screen.getByTestId('contact-info')).toHaveTextContent('bob')
    await user.click(screen.getByTestId('contact-seller'))
    expect(screen.queryByTestId('contact-info')).not.toBeInTheDocument()
  })

  it('favorites from the detail page and shows it in favorites', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-l3'))
    await user.click(screen.getByTestId('detail-fav'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('fav-item-l3')).toBeInTheDocument()
  })
})

describe('post flow', () => {
  it('blocks submitting a listing with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-post'))
    await user.click(screen.getByTestId('submit-listing'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-post')).toBeInTheDocument()
  })

  it('posts a listing and shows it on browse', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-post'))
    await user.type(screen.getByTestId('title-input'), 'Gaming chair')
    await user.click(screen.getByTestId('submit-listing'))
    expect(screen.getByTestId('page-browse')).toBeInTheDocument()
    expect(within(screen.getByTestId('listing-list')).getByText('Gaming chair')).toBeInTheDocument()
  })

  it('posts a listing with a chosen category and price', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-post'))
    await user.type(screen.getByTestId('title-input'), 'Laptop')
    await user.selectOptions(screen.getByTestId('category-select'), 'electronics')
    await user.type(screen.getByTestId('price-input'), '999')
    await user.click(screen.getByTestId('submit-listing'))
    expect(screen.getByTestId('listing-l4-title')).toHaveTextContent('Laptop')
    expect(screen.getByTestId('listing-l4-price')).toHaveTextContent('999')
  })
})

describe('favorites view', () => {
  it('shows no-favorites empty state initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('no-favorites')).toBeInTheDocument()
    expect(screen.queryByTestId('favorites-list')).not.toBeInTheDocument()
  })

  it('removing a favorite empties the favorites list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('fav-l1'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('fav-item-l1')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-browse'))
    await user.click(screen.getByTestId('fav-l1'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('no-favorites')).toBeInTheDocument()
  })
})
