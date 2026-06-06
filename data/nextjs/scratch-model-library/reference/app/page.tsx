import React, { useState } from "react";

interface Model3D {
  id: number;
  name: string;
  category: string;
  source: string;
  tags: string;
  favorited: boolean;
  file_size_mb: number;
}

const SEED_MODELS: Model3D[] = [
  { id: 1, name: "Benchy Boat", category: "calibration", source: "Thingiverse", tags: "benchy, test, boat", favorited: true, file_size_mb: 1.2 },
  { id: 2, name: "Voronoi Vase", category: "decorative", source: "Printables", tags: "vase, voronoi, home", favorited: false, file_size_mb: 3.8 },
  { id: 3, name: "Hex Box Lid", category: "storage", source: "Thingiverse", tags: "storage, hex, lid", favorited: false, file_size_mb: 0.9 },
  { id: 4, name: "Dragon Full Body", category: "figurine", source: "MyMiniFactory", tags: "dragon, fantasy", favorited: true, file_size_mb: 15.4 },
  { id: 5, name: "Cable Clip Pack", category: "utility", source: "Printables", tags: "cable, clip, utility", favorited: false, file_size_mb: 0.4 },
];

let nextId = 6;

export default function App() {
  const [models, setModels] = useState<Model3D[]>(SEED_MODELS);
  const [search, setSearch] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [tags, setTags] = useState("");
  const [fileSize, setFileSize] = useState("");

  function addModel() {
    const size = parseFloat(fileSize);
    if (!name.trim() || !category.trim() || !source.trim()) return;
    if (isNaN(size) || size <= 0) return;
    const m: Model3D = {
      id: nextId++,
      name: name.trim(),
      category: category.trim(),
      source: source.trim(),
      tags,
      favorited: false,
      file_size_mb: size,
    };
    setModels((prev) => [...prev, m]);
    setName(""); setCategory(""); setSource(""); setTags(""); setFileSize("");
  }

  function toggleFavorite(id: number) {
    setModels((prev) => prev.map((m) => m.id === id ? { ...m, favorited: !m.favorited } : m));
  }

  function removeModel(id: number) {
    setModels((prev) => prev.filter((m) => m.id !== id));
  }

  const visible = models.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFav = !favOnly || m.favorited;
    return matchSearch && matchFav;
  });

  const libraryCount = models.length;
  const favoritesCount = models.filter((m) => m.favorited).length;

  return (
    <div>
      <h1>Model Library</h1>

      <input
        data-testid="search-input"
        aria-label="Search models"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name"
      />
      <button
        data-testid="favorites-toggle"
        onClick={() => setFavOnly((v) => !v)}
      >
        {favOnly ? "Show All" : "Favorites only"}
      </button>

      <div>
        <input aria-label="Model name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Model name" />
        <input aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
        <input aria-label="Source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source" />
        <input aria-label="Tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
        <input aria-label="File size (MB)" type="number" value={fileSize} onChange={(e) => setFileSize(e.target.value)} placeholder="File size (MB)" />
        <button onClick={addModel}>Add Model</button>
      </div>

      <ul>
        {visible.map((m) => (
          <li key={m.id}>
            <span data-testid={`model-name-${m.id}`}>{m.name}</span>
            <span data-testid={`model-category-${m.id}`}>{m.category}</span>
            <span data-testid={`model-source-${m.id}`}>{m.source}</span>
            <span data-testid={`model-tags-${m.id}`}>{m.tags}</span>
            <span data-testid={`model-size-${m.id}`}>{m.file_size_mb}</span>
            <span data-testid={`model-favorited-${m.id}`}>{String(m.favorited)}</span>
            {m.favorited ? (
              <button data-testid={`model-unfavorite-btn-${m.id}`} onClick={() => toggleFavorite(m.id)}>Unfavorite</button>
            ) : (
              <button data-testid={`model-favorite-btn-${m.id}`} onClick={() => toggleFavorite(m.id)}>Favorite</button>
            )}
            <button data-testid={`model-remove-${m.id}`} onClick={() => removeModel(m.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <div>
        <span data-testid="library-count">{libraryCount} models</span>
        <span data-testid="favorites-count">{favoritesCount} favorites</span>
      </div>
    </div>
  );
}
