import { Article, Category } from './types'
let categories: Category[] = [
  { id: 'c1', name: 'Technology', description: 'Tech articles and tutorials' },
  { id: 'c2', name: 'Science', description: 'Scientific discoveries' },
  { id: 'c3', name: 'Business', description: 'Business and finance' },
]
let articles: Article[] = [
  { id: 'a1', title: 'Getting Started with React', categoryId: 'c1', categoryName: 'Technology', author: 'Jane Doe', content: 'React is a JavaScript library for building user interfaces...', status: 'published', createdDate: '2024-01-10' },
  { id: 'a2', title: 'The Future of AI', categoryId: 'c1', categoryName: 'Technology', author: 'John Smith', content: 'Artificial intelligence is transforming every industry...', status: 'published', createdDate: '2024-02-15' },
  { id: 'a3', title: 'Climate Change Solutions', categoryId: 'c2', categoryName: 'Science', author: 'Jane Doe', content: 'Scientists are working on innovative solutions to combat climate change...', status: 'draft', createdDate: '2024-03-20' },
]
let nextId = 100
function uid() { return String(++nextId) }
export function getCategories() { return [...categories] }
export function addCategory(d: Omit<Category,'id'>): Category { const c = { id: uid(), ...d }; categories.push(c); return c }
export function deleteCategory(id: string): boolean { const l = categories.length; categories = categories.filter(c => c.id !== id); return categories.length < l }
export function getArticles() { return [...articles] }
export function addArticle(d: Omit<Article,'id'>): Article { const a = { id: uid(), ...d }; articles.push(a); return a }
export function deleteArticle(id: string): boolean { const l = articles.length; articles = articles.filter(a => a.id !== id); return articles.length < l }
export function __reset() {
  categories = [
    { id: 'c1', name: 'Technology', description: 'Tech articles and tutorials' },
    { id: 'c2', name: 'Science', description: 'Scientific discoveries' },
    { id: 'c3', name: 'Business', description: 'Business and finance' },
  ]
  articles = [
    { id: 'a1', title: 'Getting Started with React', categoryId: 'c1', categoryName: 'Technology', author: 'Jane Doe', content: 'React is a JavaScript library for building user interfaces...', status: 'published', createdDate: '2024-01-10' },
    { id: 'a2', title: 'The Future of AI', categoryId: 'c1', categoryName: 'Technology', author: 'John Smith', content: 'Artificial intelligence is transforming every industry...', status: 'published', createdDate: '2024-02-15' },
    { id: 'a3', title: 'Climate Change Solutions', categoryId: 'c2', categoryName: 'Science', author: 'Jane Doe', content: 'Scientists are working on innovative solutions to combat climate change...', status: 'draft', createdDate: '2024-03-20' },
  ]
  nextId = 100
}
