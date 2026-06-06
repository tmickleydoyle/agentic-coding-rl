'use client'
import React, { useEffect, useState } from 'react'
import { Category, Article } from '../../lib/types'
export function CategoriesPage() {
  const [categories,setCategories]=useState<Category[]>([])
  const [articles,setArticles]=useState<Article[]>([])
  const [name,setName]=useState(''), [description,setDescription]=useState('')
  function load() {
    fetch('/api/categories').then(r=>r.json()).then(setCategories)
    fetch('/api/articles').then(r=>r.json()).then(setArticles)
  }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetch('/api/categories',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,description})})
      .then(()=>{setName('');setDescription('');load()})
  }
  function handleDelete(id: string) { fetch('/api/categories',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}).then(()=>load()) }
  return <div style={{padding:'2rem'}}><h1>Categories</h1>
    <ul data-testid="category-list" style={{listStyle:'none',padding:0}}>
      {categories.map(c=>{
        const ac = articles.filter(a=>a.categoryId===c.id).length
        return <li key={c.id} data-testid="category-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
          <strong>{c.name}</strong>{c.description&&` — ${c.description}`} | {ac} article(s)
          <button data-testid="delete-category" onClick={()=>handleDelete(c.id)} style={{marginLeft:'1rem'}}>Delete</button>
        </li>
      })}
    </ul>
    <h2>Add Category</h2>
    <form data-testid="add-category-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="category-name-input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required/>
      <input data-testid="category-description-input" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)}/>
      <button data-testid="submit-category" type="submit">Add Category</button>
    </form>
  </div>
}
