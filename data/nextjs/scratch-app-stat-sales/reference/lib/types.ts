export type Region = 'NA' | 'EU' | 'APAC'

export type Order = {
  id: string
  product: string
  region: Region
  revenue: number
  units: number
  month: string
}

export type Route = 'overview' | 'products' | 'regions' | 'trends'
export type Theme = 'light' | 'dark'

export const REGIONS: Region[] = ['NA', 'EU', 'APAC']
export const MONTHS: string[] = ['Jan', 'Feb', 'Mar']
