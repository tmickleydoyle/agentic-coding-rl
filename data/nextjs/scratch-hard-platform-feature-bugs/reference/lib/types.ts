export type Route = 'features' | 'bugs' | 'quality'
export type Severity = 'low' | 'high'
export type Feature = { id: number; name: string }
export type Bug = {
  id: number
  title: string
  featureId: number
  severity: Severity
  open: boolean
}
export const SEVERITIES: Severity[] = ['low', 'high']
