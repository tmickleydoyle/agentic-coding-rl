'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { HoldingsPage } from './holdings/page'
import { TransactionsPage } from './transactions/page'
import { PerformancePage } from './performance/page'
function Shell() {
  const { route } = useApp()
  const pages: Record<string,React.ReactElement> = { home:<HomePage/>, holdings:<HoldingsPage/>, transactions:<TransactionsPage/>, performance:<PerformancePage/> }
  return <div data-theme="light"><NavBar/>{pages[route]??<HomePage/>}</div>
}
export default function App() { return <AppStateProvider><Shell/></AppStateProvider> }
