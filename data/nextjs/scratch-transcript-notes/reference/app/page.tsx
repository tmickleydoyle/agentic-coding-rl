import { useState } from "react";

interface Annotation {
  id: number;
  show: string;
  speaker: string;
  quote: string;
  tag: string;
  commentary: string;
}

const SEED_ANNOTATIONS: Annotation[] = [
  { id: 1, show: "Hidden Brain", speaker: "Shankar Vedantam", quote: "We are often blind to our own biases", tag: "psychology", commentary: "Key insight about self-awareness" },
  { id: 2, show: "Freakonomics", speaker: "Stephen Dubner", quote: "Incentives are the cornerstone of modern life", tag: "economics", commentary: "Classic Freakonomics thesis" },
  { id: 3, show: "On Being", speaker: "Krista Tippett", quote: "Beauty is a teacher", tag: "philosophy", commentary: "Poetic and memorable" },
];

let nextId = 4;

export default function App() {
  const [annotations, setAnnotations] = useState<Annotation[]>(SEED_ANNOTATIONS);
  const [show, setShow] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [quote, setQuote] = useState("");
  const [tag, setTag] = useState("");
  const [commentary, setCommentary] = useState("");
  const [error, setError] = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCommentary, setEditCommentary] = useState("");

  function handleAdd() {
    if (!show.trim() || !speaker.trim() || !quote.trim() || !tag.trim() || !commentary.trim()) {
      setError("All fields are required");
      return;
    }
    setAnnotations([...annotations, { id: nextId++, show: show.trim(), speaker: speaker.trim(), quote: quote.trim(), tag: tag.trim(), commentary: commentary.trim() }]);
    setShow("");
    setSpeaker("");
    setQuote("");
    setTag("");
    setCommentary("");
    setError("");
  }

  function handleDelete(id: number) {
    setAnnotations(annotations.filter((a) => a.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function handleEdit(a: Annotation) {
    setEditingId(a.id);
    setEditCommentary(a.commentary);
  }

  function handleSave(id: number) {
    setAnnotations(annotations.map((a) => a.id === id ? { ...a, commentary: editCommentary } : a));
    setEditingId(null);
  }

  const allTags = Array.from(new Set(annotations.map((a) => a.tag)));

  const visible = filterTag === "All" ? annotations : annotations.filter((a) => a.tag === filterTag);

  return (
    <div>
      <h1>Transcript Notes</h1>
      <div data-testid="annotation-count">{annotations.length} annotations</div>
      <div>
        <label htmlFor="show-input">Show</label>
        <input id="show-input" value={show} onChange={(e) => setShow(e.target.value)} />
      </div>
      <div>
        <label htmlFor="speaker-input">Speaker</label>
        <input id="speaker-input" value={speaker} onChange={(e) => setSpeaker(e.target.value)} />
      </div>
      <div>
        <label htmlFor="quote-input">Quote</label>
        <input id="quote-input" value={quote} onChange={(e) => setQuote(e.target.value)} />
      </div>
      <div>
        <label htmlFor="tag-input">Tag</label>
        <input id="tag-input" value={tag} onChange={(e) => setTag(e.target.value)} />
      </div>
      <div>
        <label htmlFor="commentary-input-form">Commentary</label>
        <input id="commentary-input-form" value={commentary} onChange={(e) => setCommentary(e.target.value)} />
      </div>
      <button onClick={handleAdd}>Add Annotation</button>
      {error && <div data-testid="error-message">{error}</div>}
      <div>
        <label htmlFor="tag-filter">Filter by Tag</label>
        <select id="tag-filter" data-testid="tag-filter" value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
          <option value="All">All</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <ul>
        {visible.map((a) => (
          <li key={a.id} data-testid="annotation-card">
            <span data-testid="annotation-show">{a.show}</span>
            <span data-testid="annotation-speaker">{a.speaker}</span>
            <span data-testid="annotation-quote">{a.quote}</span>
            <span data-testid="annotation-tag">{a.tag}</span>
            {editingId === a.id ? (
              <>
                <input
                  data-testid="commentary-input"
                  value={editCommentary}
                  onChange={(e) => setEditCommentary(e.target.value)}
                />
                <button onClick={() => handleSave(a.id)}>Save</button>
              </>
            ) : (
              <>
                <span data-testid="annotation-commentary">{a.commentary}</span>
                <button onClick={() => handleEdit(a)}>Edit</button>
              </>
            )}
            <button onClick={() => handleDelete(a.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
