import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import { ArticlesPage } from '../reference/app/articles/page'
import { CategoriesPage } from '../reference/app/categories/page'
import { SearchPage } from '../reference/app/search/page'
import { __reset } from '../reference/lib/store'

beforeEach(() => { __reset() })

describe('Articles Page', () => {
  it('shows 3 seed articles', async () => {
    render(<ArticlesPage />)
    await waitFor(() => expect(screen.getAllByTestId('article-item').length).toBe(3))
  })

  it('filters by published', async () => {
    render(<ArticlesPage />)
    await waitFor(() => screen.getAllByTestId('article-item'))
    fireEvent.change(screen.getByTestId('article-status-filter'), { target: { value: 'published' } })
    expect(screen.getAllByTestId('article-item').length).toBe(2)
  })

  it('adds a new article', async () => {
    render(<ArticlesPage />)
    await waitFor(() => screen.getAllByTestId('article-item'))
    fireEvent.change(screen.getByTestId('article-title-input'), { target: { value: 'New Article' } })
    fireEvent.change(screen.getByTestId('article-author-input'), { target: { value: 'Author Name' } })
    fireEvent.change(screen.getByTestId('article-content-input'), { target: { value: 'Some content here' } })
    fireEvent.click(screen.getByTestId('submit-article'))
    await waitFor(() => expect(screen.getAllByTestId('article-item').length).toBe(4))
  })

  it('deletes an article', async () => {
    render(<ArticlesPage />)
    await waitFor(() => screen.getAllByTestId('article-item'))
    fireEvent.click(screen.getAllByTestId('delete-article')[0])
    await waitFor(() => expect(screen.getAllByTestId('article-item').length).toBe(2))
  })
})

describe('Categories Page', () => {
  it('shows 3 seed categories', async () => {
    render(<CategoriesPage />)
    await waitFor(() => expect(screen.getAllByTestId('category-item').length).toBe(3))
  })

  it('adds a new category', async () => {
    render(<CategoriesPage />)
    await waitFor(() => screen.getAllByTestId('category-item'))
    fireEvent.change(screen.getByTestId('category-name-input'), { target: { value: 'Health' } })
    fireEvent.click(screen.getByTestId('submit-category'))
    await waitFor(() => expect(screen.getAllByTestId('category-item').length).toBe(4))
  })
})

describe('Search Page', () => {
  it('shows search input', () => {
    render(<SearchPage />)
    expect(screen.getByTestId('search-input')).toBeDefined()
  })

  it('shows results when searching', async () => {
    render(<SearchPage />)
    await waitFor(() => {}) // wait for fetch
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'React' } })
    await waitFor(() => expect(screen.getAllByTestId('search-result-item').length).toBeGreaterThan(0))
  })

  it('shows no results for non-matching query', async () => {
    render(<SearchPage />)
    await waitFor(() => {})
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'xyznotfound' } })
    expect(screen.queryAllByTestId('search-result-item').length).toBe(0)
  })
})
