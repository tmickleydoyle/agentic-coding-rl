'use client'
import type { Campaign } from '../lib/types'

export default function CampaignItem({
  campaign,
  onSend,
  onRemove,
}: {
  campaign: Campaign
  onSend: (id: string) => void
  onRemove: (id: string) => void
}) {
  // TODO: render <li data-testid="campaign-<id>" data-status> with subject/status, an
  // open-rate span (campaign-<id>-rate), a send-<id> button only when draft, and remove-<id>.
  void onSend
  void onRemove
  return <li data-testid={`campaign-${campaign.id}`} />
}
