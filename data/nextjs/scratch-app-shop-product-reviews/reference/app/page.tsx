'use client'
import { AppStateProvider, useReviews } from '../components/AppStateProvider'
import NavBar from '../components/NavBar'
import ProductsPage from './products/page'
import ProductReviewsPage from './product-reviews/page'
import WriteReviewPage from './write-review/page'
import TopRatedPage from './top-rated/page'

function ActivePage() {
  const { route } = useReviews()
  switch (route) {
    case 'products':
      return <ProductsPage />
    case 'product-reviews':
      return <ProductReviewsPage />
    case 'write-review':
      return <WriteReviewPage />
    case 'top-rated':
      return <TopRatedPage />
    default:
      return <ProductsPage />
  }
}

function Shell() {
  const { theme } = useReviews()
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
