export type PropertyType = 'house' | 'condo' | 'townhouse'

export type Property = {
  id: string
  address: string
  type: PropertyType
  price: number
  beds: number
  baths: number
}

export type TypeFilter = 'all' | PropertyType
export type BedsFilter = 'all' | number

export type Route = 'listings' | 'property-detail' | 'favorites' | 'filters'
export type Theme = 'light' | 'dark'
