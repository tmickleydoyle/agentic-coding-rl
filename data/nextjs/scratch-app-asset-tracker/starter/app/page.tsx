'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from '../app/home/page'
import { AssetsPage } from '../app/assets/page'
import { DepreciationPage } from '../app/depreciation/page'
import { CategoriesPage } from '../app/categories/page'
function Shell() { const { route } = useApp(); const pages: Record<string, React.ReactElement> = { home: <HomePage />, assets: <AssetsPage />, depreciation: <DepreciationPage />, categories: <CategoriesPage /> }; return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div> }
export default function App() { return <AppStateProvider><Shell /></AppStateProvider> }
