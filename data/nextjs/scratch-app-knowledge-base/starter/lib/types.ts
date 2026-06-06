export interface Article { id: string; title: string; categoryId: string; categoryName: string; author: string; content: string; status: 'draft'|'published'; createdDate: string }
export interface Category { id: string; name: string; description: string }
export type Route = 'home'|'articles'|'categories'|'search'
export interface AppState { route: Route; setRoute: (r: Route) => void }
