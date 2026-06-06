'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { SuppliersPage } from './suppliers/page'
import { ContactsPage } from './contacts/page'
import { ContractsPage } from './contracts/page'

function Shell() {
  const { route } = useApp()
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, suppliers: <SuppliersPage />, contacts: <ContactsPage />, contracts: <ContractsPage />,
  }
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>
}
