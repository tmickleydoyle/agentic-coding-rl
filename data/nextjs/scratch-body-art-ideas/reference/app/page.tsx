import React, { useState } from "react";

interface BodyArtIdea {
  id: number;
  title: string;
  description: string;
  tags: string;
  favorite: boolean;
}

const SEED_IDEAS: BodyArtIdea[] = [
  { id: 1, title: "Mandala back piece", description: "Full back mandala in dotwork", tags: "dotwork, mandala, back", favorite: false },
  { id: 2, title: "Snake arm wrap", description: "Black and grey snake wrapping forearm", tags: "blackgrey, snake, forearm", favorite: true },
  { id: 3, title: "Watercolor hummingbird", description: "Bright watercolor hummingbird on shoulder", tags: "watercolor, bird, shoulder", favorite: false },
  { id: 4, title: "Script quote", description: "Minimalist script on ribs", tags: "script, minimalist, ribs", favorite: true },
];

export default function App() {
  const [ideas, setIdeas] = useState<BodyArtIdea[]>(SEED_IDEAS);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [search, setSearch] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [nextId, setNextId] = useState(5);

  const handleAdd = () => {
    if (!title.trim()) return;
    const newIdea: BodyArtIdea = {
      id: nextId,
      title: title.trim(),
      description: description.trim(),
      tags: tags.trim(),
      favorite: false,
    };
    setIdeas([...ideas, newIdea]);
    setNextId(nextId + 1);
    setTitle("");
    setDescription("");
    setTags("");
  };

  const toggleFavorite = (id: number) => {
    setIdeas(ideas.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)));
  };

  const deleteIdea = (id: number) => {
    setIdeas(ideas.filter((i) => i.id !== id));
  };

  const visible = ideas.filter((idea) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      idea.title.toLowerCase().includes(q) ||
      idea.description.toLowerCase().includes(q);
    const matchesFav = !favoritesOnly || idea.favorite;
    return matchesSearch && matchesFav;
  });

  return (
    <div>
      <h1>Body Art Ideas</h1>

      <div data-testid="add-form">
        <input
          data-testid="title-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          data-testid="description-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          data-testid="tags-input"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button data-testid="add-button" onClick={handleAdd}>
          Add Idea
        </button>
      </div>

      <div data-testid="search-section">
        <input
          data-testid="search-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div data-testid="filters-section">
        <label>
          <input
            data-testid="favorites-filter"
            type="checkbox"
            checked={favoritesOnly}
            onChange={(e) => setFavoritesOnly(e.target.checked)}
          />
          Show favorites only
        </label>
      </div>

      <div data-testid="idea-count">{visible.length} ideas</div>

      <div data-testid="ideas-list">
        {visible.map((idea) => (
          <div key={idea.id} data-testid="idea-card">
            <span data-testid="idea-title">{idea.title}</span>
            <span data-testid="idea-description">{idea.description}</span>
            <div data-testid="idea-tags">
              {idea.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((tag, idx) => (
                  <span key={idx} data-testid="tag-chip">
                    {tag}
                  </span>
                ))}
            </div>
            {idea.favorite && <span data-testid="favorite-badge">Favorite</span>}
            <button
              data-testid="toggle-favorite-button"
              onClick={() => toggleFavorite(idea.id)}
            >
              {idea.favorite ? "Unfavorite" : "Favorite"}
            </button>
            <button
              data-testid="delete-button"
              onClick={() => deleteIdea(idea.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
