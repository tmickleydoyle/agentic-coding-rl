export type Segment = 'all' | 'mobile' | 'desktop'

export type Step = {
  id: string
  name: string
  order: number
  counts: Record<Segment, number>
}

export type FunnelRow = {
  id: string
  name: string
  count: number
  dropOff: number
  conversion: number
}

export type Route = 'funnel' | 'steps' | 'segments' | 'settings'
export type Theme = 'light' | 'dark'

export const SEGMENTS: Segment[] = ['all', 'mobile', 'desktop']
