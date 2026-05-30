'use client'
import { useApp } from '../components/AppStateProvider'
import type { Campaign, Subscriber } from '../lib/types'

export type NewsletterStats = {
  totalCampaigns: number
  sent: number
  draft: number
  totalSubscribers: number
  activeSubscribers: number
}

export function computeStats(_campaigns: Campaign[], _subscribers: Subscriber[]): NewsletterStats {
  // TODO: compute campaign + subscriber stats
  return { totalCampaigns: 0, sent: 0, draft: 0, totalSubscribers: 0, activeSubscribers: 0 }
}

export function openRate(_campaign: Campaign): number {
  // TODO: round(opens/recipients*100), or 0 if no recipients
  return 0
}

export function filterCampaigns(
  _campaigns: Campaign[],
  _statusFilter: 'all' | 'draft' | 'sent',
): Campaign[] {
  // TODO: apply the status filter
  return []
}

export function useNewsletter() {
  const { campaigns, subscribers, statusFilter } = useApp()
  const stats = computeStats(campaigns, subscribers)
  const filtered = filterCampaigns(campaigns, statusFilter)
  return { stats, filtered }
}
