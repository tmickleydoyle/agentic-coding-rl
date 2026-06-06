'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from '../app/home/page'
import { LibraryPage } from '../app/library/page'
import { ArtistsPage } from '../app/artists/page'
import { QueuePage } from '../app/queue/page'
function Shell() { const { route } = useApp(); const pages: Record<string, React.ReactElement> = { home: <HomePage />, library: <LibraryPage />, artists: <ArtistsPage />, queue: <QueuePage /> }; return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div> }
export default function App() { return <AppStateProvider><Shell /></AppStateProvider> }
