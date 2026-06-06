import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addPartner, filterPartnersByLanguage } from "../../lib/store";
import type { Language } from "../../lib/types";

const LANGUAGES: Language[] = ["Spanish", "French", "German", "Japanese", "Mandarin", "Portuguese"];

export default function PartnersPage() {
  const { partners, setPartners } = useApp();
  const [filterLang, setFilterLang] = useState<Language | "">("");
  const [name, setName] = useState("");
  const [native, setNative] = useState<Language>("Spanish");
  const [learning, setLearning] = useState<Language>("French");
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!name.trim()) { setError("Name required"); return; }
    if (native === learning) { setError("Native and learning languages must differ"); return; }
    const p = addPartner({ name: name.trim(), nativeLanguage: native, learningLanguage: learning, level, bio, online: false });
    setPartners([...partners, p]);
    setName(""); setBio(""); setError("");
  }

  const displayed = filterLang ? partners.filter(p => p.nativeLanguage === filterLang || p.learningLanguage === filterLang) : partners;

  return (
    <div data-testid="partners-page">
      <h2>Language Partners</h2>
      {error && <div data-testid="partner-error">{error}</div>}
      <div>
        <select data-testid="filter-language" value={filterLang} onChange={e => setFilterLang(e.target.value as Language | "")}>
          <option value="">All Languages</option>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <ul data-testid="partner-list">
        {displayed.map(p => (
          <li key={p.id} data-testid={`partner-item-${p.id}`}>
            <span data-testid={`partner-name-${p.id}`}>{p.name}</span>
            <span data-testid={`partner-native-${p.id}`}>{p.nativeLanguage}</span>
            <span data-testid={`partner-learning-${p.id}`}>{p.learningLanguage}</span>
            <span data-testid={`partner-level-${p.id}`}>{p.level}</span>
            {p.online && <span data-testid={`partner-online-${p.id}`}>Online</span>}
          </li>
        ))}
      </ul>
      <div data-testid="add-partner-form">
        <input data-testid="input-partner-name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
        <select data-testid="select-native" value={native} onChange={e => setNative(e.target.value as Language)}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select data-testid="select-learning" value={learning} onChange={e => setLearning(e.target.value as Language)}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select data-testid="select-level" value={level} onChange={e => setLevel(e.target.value as "beginner" | "intermediate" | "advanced")}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <input data-testid="input-bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Bio" />
        <button data-testid="btn-add-partner" onClick={handleAdd}>Add Partner</button>
      </div>
    </div>
  );
}
