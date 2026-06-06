import { Article, Category } from './types'
export function getCategories(): Category[] { return [] }
export function addCategory(_d: Omit<Category,'id'>): Category { return { id:'',name:'',description:'' } }
export function deleteCategory(_id: string): boolean { return false }
export function getArticles(): Article[] { return [] }
export function addArticle(_d: Omit<Article,'id'>): Article { return { id:'',title:'',categoryId:'',categoryName:'',author:'',content:'',status:'draft',createdDate:'' } }
export function deleteArticle(_id: string): boolean { return false }
export function __reset() {}
