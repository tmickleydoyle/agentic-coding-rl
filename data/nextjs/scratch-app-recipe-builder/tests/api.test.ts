import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET, POST } from '../reference/app/api/recipes/route'

beforeEach(() => __reset())

describe('Recipes API', () => {
  it('GET /api/recipes returns 3 seed recipes', async () => {
    const req = new Request('http://localhost/api/recipes')
    const res = await GET(req)
    const data = await res.json()
    expect(data.recipes.length).toBe(3)
  })

  it('POST /api/recipes creates a recipe', async () => {
    const req = new Request('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ name: 'Soup', description: 'Warm soup', ingredients: ['broth', 'veggies'] }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const recipe = await res.json()
    expect(recipe.name).toBe('Soup')
    expect(recipe.favorite).toBe(false)
  })

  it('POST /api/recipes returns 400 for missing name', async () => {
    const req = new Request('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ description: 'No name' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET /api/recipes/ingredients returns seed ingredients', async () => {
    const req = new Request('http://localhost/api/recipes/ingredients')
    const res = await GET(req)
    const data = await res.json()
    expect(data.ingredients.length).toBe(2)
  })

  it('POST /api/recipes/ingredients creates ingredient', async () => {
    const req = new Request('http://localhost/api/recipes/ingredients', {
      method: 'POST',
      body: JSON.stringify({ name: 'salt', quantity: '1tsp' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const ing = await res.json()
    expect(ing.name).toBe('salt')
  })

  it('GET /api/recipes after POST includes new recipe', async () => {
    const postReq = new Request('http://localhost/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ name: 'Wrap', description: '', ingredients: [] }),
    })
    await POST(postReq)
    const getReq = new Request('http://localhost/api/recipes')
    const res = await GET(getReq)
    const data = await res.json()
    expect(data.recipes.length).toBe(4)
  })
})
