export type Option = { id: string; label: string }
export type Fetcher = (query: string) => Promise<Option[]>
