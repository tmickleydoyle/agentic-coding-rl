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

export function computeStats(campaigns: Campaign[], subscribers: Subscriber[]): NewsletterStats {
  let sent = 0
  campaigns.forEach((c) => {
    if (c.status === 'sent') sent += 1
  })
  let active = 0
  subscribers.forEach((s) => {
    if (s.active) active += 1
  })
  return {
    totalCampaigns: campaigns.length,
    sent,
    draft: campaigns.length - sent,
    totalSubscribers: subscribers.length,
    activeSubscribers: active,
  }
}

export function openRate(campaign: Campaign): number {
  if (campaign.recipients === 0) return 0
  return Math.round((campaign.opens / campaign.recipients) * 100)
}

export function filterCampaigns(
  campaigns: Campaign[],
  statusFilter: 'all' | 'draft' | 'sent',
): Campaign[] {
  return campaigns.filter((c) => statusFilter === 'all' || c.status === statusFilter)
}

export function useNewsletter() {
  const { campaigns, subscribers, statusFilter } = useApp()
  const stats = computeStats(campaigns, subscribers)
  const filtered = filterCampaigns(campaigns, statusFilter)
  return { stats, filtered }
}
