'use client'
import { AppStateProvider, useRecipes } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import RecipesPage from './recipes/page'
import RecipeDetailPage from './recipe-detail/page'
import AddRecipePage from './add/page'
import FavoritesPage from './favorites/page'

function ActivePage() {
  const { route } = useRecipes()
  switch (route) {
    case 'recipes':
      return <RecipesPage />
    case 'recipe-detail':
      return <RecipeDetailPage />
    case 'add':
      return <AddRecipePage />
    case 'favorites':
      return <FavoritesPage />
    default:
      return <RecipesPage />
  }
}

function Shell() {
  const { theme } = useRecipes()
  return (
    <div data-testid="app-root" data-theme={theme}>
      <NavBar />
      <main data-testid="page-content">
        <ActivePage />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <Shell />
    </AppStateProvider>
  )
}
