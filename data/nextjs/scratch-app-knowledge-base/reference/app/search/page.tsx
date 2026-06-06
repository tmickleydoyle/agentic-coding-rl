'use client'
import React, { useEffect, useState } from 'react'
import { Article } from '../../lib/types'
export function SearchPage() {
  const [articles,setArticles]=useState<Article[]>([])
  const [query,setQuery]=useState('')
  useEffect(()=>{ fetch('/api/articles').then(r=>r.json()).then(setArticles) },[])
  const results = query.trim()==='' ? [] : articles.filter(a=>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.content.toLowerCase().includes(query.toLowerCase())
  )
  return <div style={{padding:'2rem'}}><h1>Search</h1>
    <input data-testid="search-input" placeholder="Search articles..." value={query} onChange={e=>setQuery(e.target.value)} style={{width:'100%',padding:'0.5rem',marginBottom:'1rem'}}/>
    <ul data-testid="search-results" style={{listStyle:'none',padding:0}}>
      {results.map(a=><li key={a.id} data-testid="search-result-item" style={{padding:'0.5rem',border:'1px solid #ccc',marginBottom:'0.5rem'}}>
        <strong>{a.title}</strong> by {a.author}
        <p style={{margin:'0.25rem 0 0 0',color:'#555',fontSize:'0.9em'}}>{a.content.substring(0,100)}...</p>
      </li>)}
    </ul>
  </div>
}
