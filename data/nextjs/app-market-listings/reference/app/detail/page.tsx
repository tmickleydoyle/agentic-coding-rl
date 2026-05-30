'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

export default function DetailPage() {
  const { listings, selectedId, favorites, toggleFavorite } = useApp()
  const [showContact, setShowContact] = useState(false)
  const listing = listings.find((l) => l.id === selectedId)

  if (!listing) {
    return (
      <section data-testid="page-detail">
        <p data-testid="no-selection">No listing selected.</p>
      </section>
    )
  }

  const favorited = favorites.includes(listing.id)

  return (
    <section data-testid="page-detail">
      <h1 data-testid="detail-title">{listing.title}</h1>
      <p data-testid="detail-price">{listing.price}</p>
      <p data-testid="detail-seller">{listing.seller}</p>
      <p data-testid="detail-description">{listing.description}</p>
      <button data-testid="contact-seller" onClick={() => setShowContact((s) => !s)}>
        Contact seller
      </button>
      {showContact ? (
        <p data-testid="contact-info">Contact {listing.seller}</p>
      ) : null}
      <button data-testid="detail-fav" onClick={() => toggleFavorite(listing.id)}>
        {favorited ? 'Unfavorite' : 'Favorite'}
      </button>
    </section>
  )
}
