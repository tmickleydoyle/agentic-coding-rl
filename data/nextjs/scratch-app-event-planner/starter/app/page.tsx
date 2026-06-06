'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { EventsPage } from './events/page'
import { GuestsPage } from './guests/page'
import { AgendaPage } from './agenda/page'
function Shell() {
  const { route } = useApp()
  const pages: Record<string,React.ReactElement> = { home:<HomePage/>, events:<EventsPage/>, guests:<GuestsPage/>, agenda:<AgendaPage/> }
  return <div data-theme="light"><NavBar/>{pages[route]??<HomePage/>}</div>
}
export default function App() { return <AppStateProvider><Shell/></AppStateProvider> }
