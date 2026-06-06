export interface Note { id: string; title: string; body: string; tags: string[]; archived: boolean; createdAt: string; updatedAt: string; }
export type Route = 'home' | 'notes' | 'tags' | 'archive';
