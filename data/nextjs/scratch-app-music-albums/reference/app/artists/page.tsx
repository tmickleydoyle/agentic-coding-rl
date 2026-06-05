'use client'
import { useApp } from '../../components/AppStateProvider'
import { useAlbums } from '../../hooks/useAlbums'

export default function ArtistsPage() {
  const { openArtist } = useApp()
  const { artists, albumCountByArtist } = useAlbums()

  return (
    <section data-testid="page-artists">
      <h1>Artists</h1>
      <ul data-testid="artist-list">
        {artists.map((name) => (
          <li key={name} data-testid={`artist-${name}`}>
            <span data-testid={`artist-${name}-count`}>{albumCountByArtist[name] ?? 0}</span>
            <button data-testid={`view-${name}`} onClick={() => openArtist(name)}>
              View albums
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
