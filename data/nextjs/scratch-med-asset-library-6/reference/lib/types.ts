export type AssetType = 'logo' | 'icon' | 'photo'
export type Route = 'library' | 'stats' | 'settings'
export type Asset = { id: number; name: string; type: AssetType; tags: string }
