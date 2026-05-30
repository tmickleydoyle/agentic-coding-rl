export type Category = 'account' | 'billing' | 'technical' | 'general'

export type Article = {
  id: string
  title: string
  body: string
  category: Category
  helpful: number
  notHelpful: number
}

export type CategoryFilter = 'all' | Category

export type Route = 'articles' | 'article-detail' | 'categories' | 'search'
export type Theme = 'light' | 'dark'
