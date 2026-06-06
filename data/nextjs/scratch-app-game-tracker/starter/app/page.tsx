'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { GamesPage } from './games/page'
import { SessionsPage } from './sessions/page'
import { AchievementsPage } from './achievements/page'
function Shell() {
  const { route } = useApp()
  const pages: Record<string,React.ReactElement> = { home:<HomePage/>, games:<GamesPage/>, sessions:<SessionsPage/>, achievements:<AchievementsPage/> }
  return <div data-theme="light"><NavBar/>{pages[route]??<HomePage/>}</div>
}
export default function App() { return <AppStateProvider><Shell/></AppStateProvider> }
