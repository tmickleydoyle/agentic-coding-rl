'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { TasksPage } from './tasks/page'
import { HistoryPage } from './history/page'
import { RoomsPage } from './rooms/page'
function Shell() {
  const { route } = useApp()
  const pages: Record<string,React.ReactElement> = { home:<HomePage/>, tasks:<TasksPage/>, history:<HistoryPage/>, rooms:<RoomsPage/> }
  return <div data-theme="light"><NavBar/>{pages[route]??<HomePage/>}</div>
}
export default function App() { return <AppStateProvider><Shell/></AppStateProvider> }
