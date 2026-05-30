export type Category = 'design' | 'writing' | 'dev' | 'audio'

export type Review = {
  id: string
  author: string
  rating: number
  text: string
}

export type Gig = {
  id: string
  title: string
  category: Category
  price: number
  reviews: Review[]
}

export type Booking = {
  id: string
  gigId: string
  name: string
}

export type CategoryFilter = 'all' | Category

export type Route = 'gigs' | 'detail' | 'book' | 'bookings'
export type Theme = 'light' | 'dark'

export const CATEGORIES: Category[] = ['design', 'writing', 'dev', 'audio']
