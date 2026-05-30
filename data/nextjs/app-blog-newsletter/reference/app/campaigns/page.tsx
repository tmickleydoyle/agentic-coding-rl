'use client'
import { useApp } from '../../components/AppStateProvider'
import { useNewsletter } from '../../hooks/useNewsletter'
import CampaignItem from '../../components/CampaignItem'

export default function CampaignsPage() {
  const { statusFilter, setStatusFilter, sendCampaign, removeCampaign } = useApp()
  const { filtered } = useNewsletter()

  return (
    <section data-testid="page-campaigns">
      <h1>Campaigns</h1>
      <label htmlFor="status-filter">Status</label>
      <select
        id="status-filter"
        data-testid="status-filter"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
      >
        <option value="all">All</option>
        <option value="draft">Draft</option>
        <option value="sent">Sent</option>
      </select>
      {filtered.length === 0 ? (
        <p data-testid="empty-state">No campaigns match this filter.</p>
      ) : (
        <ul data-testid="campaign-list">
          {filtered.map((c) => (
            <CampaignItem
              key={c.id}
              campaign={c}
              onSend={sendCampaign}
              onRemove={removeCampaign}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
