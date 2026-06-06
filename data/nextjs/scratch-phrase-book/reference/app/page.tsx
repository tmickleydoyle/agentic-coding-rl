'use client'
import { useState } from 'react'

interface Phrase {
  id: number
  english: string
  translation: string
  category: string
  favorite: boolean
}

const SEED: Phrase[] = [
  { id: 1, english: 'Where is the bathroom?', translation: 'Où sont les toilettes?', category: 'Essentials', favorite: false },
  { id: 2, english: 'How much does it cost?', translation: 'Combien ça coûte?', category: 'Shopping', favorite: false },
  { id: 3, english: 'I need a doctor.', translation: "J'ai besoin d'un médecin.", category: 'Essentials', favorite: false },
  { id: 4, english: 'A table for two, please.', translation: "Une table pour deux, s'il vous plaît.", category: 'Restaurant', favorite: false },
  { id: 5, english: 'Can I have the bill?', translation: "L'addition, s'il vous plaît.", category: 'Restaurant', favorite: false },
  { id: 6, english: 'Do you have this in another size?', translation: 'Avez-vous ceci dans une autre taille?', category: 'Shopping', favorite: false },
]

export default function App() {
  const [phrases, setPhrases] = useState<Phrase[]>(SEED.map(p => ({ ...p })))
  const [category, setCategory] = useState('All')
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  const visible = phrases.filter(p => {
    const matchCat = category === 'All' || p.category === category
    const matchFav = !favoritesOnly || p.favorite
    return matchCat && matchFav
  })

  function toggleFavorite(id: number) {
    setPhrases(prev => prev.map(p => p.id === id ? { ...p, favorite: !p.favorite } : p))
  }

  return (
    <div>
      <h1>Phrase Book</h1>

      <div data-testid="phrase-count">{visible.length} phrases</div>

      <select
        data-testid="category-filter"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Essentials">Essentials</option>
        <option value="Shopping">Shopping</option>
        <option value="Restaurant">Restaurant</option>
      </select>

      <button
        data-testid="favorites-toggle"
        onClick={() => setFavoritesOnly(f => !f)}
      >
        {favoritesOnly ? 'Show All' : 'Show Favorites'}
      </button>

      <div>
        {visible.map(phrase => (
          <div key={phrase.id} data-testid={`phrase-${phrase.id}`}>
            <span data-testid={`english-${phrase.id}`}>{phrase.english}</span>
            <span data-testid={`translation-${phrase.id}`}>{phrase.translation}</span>
            <span data-testid={`category-${phrase.id}`}>{phrase.category}</span>
            <button
              data-testid={`favorite-btn-${phrase.id}`}
              onClick={() => toggleFavorite(phrase.id)}
            >
              {phrase.favorite ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
