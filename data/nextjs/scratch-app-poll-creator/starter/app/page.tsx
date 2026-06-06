'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from '../app/home/page'
import { PollsPage } from '../app/polls/page'
import { VotePage } from '../app/vote/page'
import { ResultsPage } from '../app/results/page'
function Shell() { const { route } = useApp(); const pages: Record<string, React.ReactElement> = { home: <HomePage />, polls: <PollsPage />, vote: <VotePage />, results: <ResultsPage /> }; return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div> }
export default function App() { return <AppStateProvider><Shell /></AppStateProvider> }
