'use client'
import type { Campaign } from '../lib/types'
import { openRate } from '../hooks/useNewsletter'

export default function CampaignItem({
  campaign,
  onSend,
  onRemove,
}: {
  campaign: Campaign
  onSend: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
    <li data-testid={`campaign-${campaign.id}`} data-status={campaign.status}>
      <span data-testid={`campaign-${campaign.id}-subject`}>{campaign.subject}</span>
      <span data-testid={`campaign-${campaign.id}-status`}>{campaign.status}</span>
      <span data-testid={`campaign-${campaign.id}-rate`}>{openRate(campaign)}%</span>
      {campaign.status === 'draft' ? (
        <button data-testid={`send-${campaign.id}`} onClick={() => onSend(campaign.id)}>
          Send
        </button>
      ) : null}
      <button data-testid={`remove-${campaign.id}`} onClick={() => onRemove(campaign.id)}>
        Delete
      </button>
    </li>
  )
}
