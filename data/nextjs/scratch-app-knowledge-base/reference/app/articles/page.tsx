'use client'
import React, { useEffect, useState } from 'react'
import { Article, Category } from '../../lib/types'
export function ArticlesPage() {
  const [articles,setArticles]=useState<Article[]>([])
  const [categories,setCategories]=useState<Category[]>([])
  const [filter,setFilter]=useState('all')
  const [title,setTitle]=useState(''), [categoryId,setCategoryId]=useState(''), [author,setAuthor]=useState(''), [content,setContent]=useState(''), [status,setStatus]=useState<Article['status']>('draft')
  function load() {
    fetch('/api/articles').then(r=>r.json()).then(setArticles)
    fetch('/api/categories').then(r=>r.json()).then((cs:Category[])=>{ setCategories(cs); if(cs.length>0&&!categoryId) setCategoryId(cs[0].id) })
  }
  useEffect(()=>{load()},[])
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const today = new Date().toISOString().split('T')[0]
    fetch('/api/articles',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,categoryId,author,content,status,createdDate:today})})
      .then(()=>{setTitle('');setAuthor('');setContent('');load()})
  }
  function handleDelete(id: string) { fetch('/api/articles',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})}).then(()=>load()) }
  const filtered = filter==='all' ? articles : articles.filter(a=>a.status===filter)
  return <div style={{padding:'2rem'}}><h1>Articles</h1>
    <select data-testid="article-status-filter" value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">all</option><option value="draft">draft</option><option value="published">published</option></select>
    <ul data-testid="article-list" style={{listStyle:'none',padding:0,marginTop:'1rem'}}>
      {filtered.map(a=><li key={a.id} data-testid="article-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{a.title}</strong> — {a.categoryName} | {a.author} | {a.status}
        <button data-testid="delete-article" onClick={()=>handleDelete(a.id)} style={{marginLeft:'1rem'}}>Delete</button>
      </li>)}
    </ul>
    <h2>Add Article</h2>
    <form data-testid="add-article-form" onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'0.5rem',maxWidth:'400px'}}>
      <input data-testid="article-title-input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
      <select data-testid="article-category-select" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <input data-testid="article-author-input" placeholder="Author" value={author} onChange={e=>setAuthor(e.target.value)} required/>
      <textarea data-testid="article-content-input" placeholder="Content" value={content} onChange={e=>setContent(e.target.value)} required/>
      <select data-testid="article-status-select" value={status} onChange={e=>setStatus(e.target.value as Article['status'])}><option value="draft">draft</option><option value="published">published</option></select>
      <button data-testid="submit-article" type="submit">Add Article</button>
    </form>
  </div>
}
