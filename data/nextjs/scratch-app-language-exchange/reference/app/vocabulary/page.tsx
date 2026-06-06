import React, { useState } from "react";
import { useApp } from "../../components/AppStateProvider";
import { addVocabWord, toggleMastered } from "../../lib/store";
import type { Language } from "../../lib/types";

const LANGUAGES: Language[] = ["Spanish", "French", "German", "Japanese", "Mandarin", "Portuguese"];

export default function VocabularyPage() {
  const { vocabWords, setVocabWords } = useApp();
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [language, setLanguage] = useState<Language>("Spanish");
  const [error, setError] = useState("");

  function handleAdd() {
    if (!word.trim() || !translation.trim()) {
      setError("Word and translation required");
      return;
    }
    const newWord = addVocabWord({ word: word.trim(), translation: translation.trim(), language, mastered: false });
    setVocabWords([...vocabWords, newWord]);
    setWord("");
    setTranslation("");
    setError("");
  }

  function handleToggle(id: string) {
    const updated = toggleMastered(id);
    if (updated) {
      setVocabWords(vocabWords.map(v => v.id === id ? updated : v));
    }
  }

  const mastered = vocabWords.filter(v => v.mastered).length;

  return (
    <div data-testid="vocabulary-page">
      <h2>Vocabulary</h2>
      <div data-testid="mastered-count">{mastered} / {vocabWords.length} mastered</div>
      {error && <div data-testid="vocab-error">{error}</div>}
      <div>
        <input data-testid="input-word" value={word} onChange={e => setWord(e.target.value)} placeholder="Word" />
        <input data-testid="input-translation" value={translation} onChange={e => setTranslation(e.target.value)} placeholder="Translation" />
        <select data-testid="select-language" value={language} onChange={e => setLanguage(e.target.value as Language)}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <button data-testid="btn-add-word" onClick={handleAdd}>Add Word</button>
      </div>
      <ul data-testid="vocab-list">
        {vocabWords.map(v => (
          <li key={v.id} data-testid={`vocab-item-${v.id}`}>
            <span data-testid={`word-text-${v.id}`}>{v.word}</span>
            <span data-testid={`word-translation-${v.id}`}>{v.translation}</span>
            <span data-testid={`word-language-${v.id}`}>{v.language}</span>
            <button
              data-testid={`btn-toggle-${v.id}`}
              onClick={() => handleToggle(v.id)}
            >
              {v.mastered ? "Unmaster" : "Master"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
