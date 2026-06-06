'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { ArticlesPage } from './articles/page'
import { CategoriesPage } from './categories/page'
import { SearchPage } from './search/page'
function Shell() {
  const { route } = useApp()
  const pages: Record<string,React.ReactElement> = { home:<HomePage/>, articles:<ArticlesPage/>, categories:<CategoriesPage/>, search:<SearchPage/> }
  return <div data-theme="light"><NavBar/>{pages[route]??<HomePage/>}</div>
}
export default function App() { return <AppStateProvider><Shell/></AppStateProvider> }
