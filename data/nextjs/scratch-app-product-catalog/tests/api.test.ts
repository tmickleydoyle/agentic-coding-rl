import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getCategories, addCategory, getProducts, addProduct, toggleProduct, getReviews, addReview } from '../lib/store'

beforeEach(() => { __reset() })

describe('Store API', () => {
  it('getCategories returns 3 seed categories', () => {
    expect(getCategories().length).toBe(3)
  })

  it('addCategory increments list', () => {
    addCategory({ name: 'Toys', description: 'Fun stuff' })
    expect(getCategories().length).toBe(4)
  })

  it('getProducts returns 5 seed products', () => {
    expect(getProducts().length).toBe(5)
  })

  it('addProduct sets active true', () => {
    addProduct({ name: 'X', sku: 'SKU999', price: 9.99, categoryId: 'c1', stock: 10 })
    const ps = getProducts()
    expect(ps[ps.length - 1].active).toBe(true)
  })

  it('toggleProduct flips active from true to false', () => {
    toggleProduct('p1')
    expect(getProducts().find(p => p.id === 'p1')?.active).toBe(false)
  })

  it('toggleProduct flips active from false to true', () => {
    toggleProduct('p4')
    expect(getProducts().find(p => p.id === 'p4')?.active).toBe(true)
  })

  it('getReviews returns 4 seed reviews', () => {
    expect(getReviews().length).toBe(4)
  })

  it('addReview increments list', () => {
    addReview({ productId: 'p1', rating: 5, comment: 'Great!', reviewer: 'Test' })
    expect(getReviews().length).toBe(5)
  })
})
