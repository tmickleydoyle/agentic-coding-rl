'use client'
import React, { useEffect, useState } from 'react'
import { Article } from '../../lib/types'
export function HomePage() {
  const [articles,setArticles]=useState<Article[]>([])
  const [cc,setCc]=useState(0)
  useEffect(()=>{
    fetch('/api/articles').then(r=>r.json()).then(setArticles)
    fetch('/api/categories').then(r=>r.json()).then((d:unknown[])=>setCc(d.length))
  },[])
  return <div style={{padding:'2rem'}}><h1>Knowledge Base</h1>
    <p>Articles: <span data-testid="dashboard-article-count">{articles.length}</span></p>
    <p>Categories: <span data-testid="dashboard-category-count">{cc}</span></p>
    <p>Published: <span data-testid="dashboard-published-count">{articles.filter(a=>a.status==='published').length}</span></p>
  </div>
}
