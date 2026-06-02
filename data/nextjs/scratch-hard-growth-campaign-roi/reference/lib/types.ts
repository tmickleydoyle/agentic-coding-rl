export type Route = 'campaigns' | 'channels' | 'overview' | 'settings'
export const ROUTES: Route[] = ['campaigns', 'channels', 'overview', 'settings']

export type Campaign = {
  id: number
  name: string
  channel: string
  spend: number
  conversions: number
}

export const CHANNELS = ['Search', 'Social', 'Email', 'Display']

// Revenue earned per conversion (used for ROI / ROAS math).
export const VALUE_PER_CONVERSION = 50
