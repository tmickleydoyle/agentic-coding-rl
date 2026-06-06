'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { BooksPage } from './books/page'
import { ReviewsPage } from './reviews/page'
import { MembersPage } from './members/page'
function Shell() {
  const { route } = useApp()
  const pages: Record<string,React.ReactElement> = { home:<HomePage/>, books:<BooksPage/>, reviews:<ReviewsPage/>, members:<MembersPage/> }
  return <div data-theme="light"><NavBar/>{pages[route]??<HomePage/>}</div>
}
export default function App() { return <AppStateProvider><Shell/></AppStateProvider> }
