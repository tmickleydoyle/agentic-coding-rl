import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('recipe detail', () => {
  it('shows no-selection when nothing is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-recipe-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('views a recipe and shows its ingredients and steps', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-r1'))
    expect(screen.getByTestId('page-recipe-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Margherita Pizza')
    expect(screen.getByTestId('detail-cuisine')).toHaveTextContent('Italian')
    expect(screen.getByTestId('detail-minutes')).toHaveTextContent('30')
    const ings = screen.getByTestId('ingredient-list')
    expect(within(ings).getByText('mozzarella')).toBeInTheDocument()
    const steps = screen.getByTestId('step-list')
    expect(within(steps).getByText('bake')).toBeInTheDocument()
  })

  it('toggles favorite from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-r3'))
    expect(screen.getByTestId('recipe-detail')).toHaveAttribute('data-favorite', 'false')
    await user.click(screen.getByTestId('detail-fav-toggle'))
    expect(screen.getByTestId('recipe-detail')).toHaveAttribute('data-favorite', 'true')
  })
})

describe('add recipe', () => {
  it('blocks submitting a recipe with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.click(screen.getByTestId('submit-recipe'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('adds a recipe and shows it in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Greek Salad')
    await user.type(screen.getByTestId('cuisine-input'), 'Greek')
    await user.type(screen.getByTestId('ingredients-input'), 'cucumber\ntomato\nfeta')
    await user.type(screen.getByTestId('steps-input'), 'chop\ntoss')
    await user.click(screen.getByTestId('submit-recipe'))
    expect(screen.getByTestId('page-recipes')).toBeInTheDocument()
    expect(within(screen.getByTestId('recipe-list')).getByText('Greek Salad')).toBeInTheDocument()
  })

  it('parses the added recipe ingredients/steps on its detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('title-input'), 'Omelette')
    await user.type(screen.getByTestId('ingredients-input'), 'eggs\n\nbutter')
    await user.type(screen.getByTestId('steps-input'), 'beat\ncook')
    await user.click(screen.getByTestId('submit-recipe'))
    await user.click(screen.getByTestId('view-r5'))
    const ings = screen.getByTestId('ingredient-list')
    // blank line dropped: eggs + butter only
    expect(within(ings).getAllByRole('listitem')).toHaveLength(2)
    expect(within(ings).getByText('butter')).toBeInTheDocument()
  })
})

describe('favorites page', () => {
  it('lists only favorited recipes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('fav-recipe-r2')).toBeInTheDocument()
    expect(screen.queryByTestId('fav-recipe-r1')).not.toBeInTheDocument()
  })

  it('removing a favorite empties the favorites page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    await user.click(screen.getByTestId('unfav-r2'))
    expect(screen.getByTestId('no-favorites')).toBeInTheDocument()
  })

  it('favoriting on the list shows up on the favorites page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('fav-r1'))
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('fav-recipe-r1')).toBeInTheDocument()
  })
})

describe('theme', () => {
  it('persists theme across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    // theme isn't toggled by UI here; just assert the default reflects on root
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
