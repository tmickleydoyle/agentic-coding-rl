'use client';
import React from 'react';
export function DecksPage() {
  return <div><h2>Decks</h2>
    <form data-testid="deck-add-form">
      <input data-testid="deck-name-input" placeholder="Deck name" />
      <input data-testid="deck-lang-input" placeholder="Language" />
      <button data-testid="deck-submit" type="submit">Add Deck</button>
    </form>
    <ul data-testid="deck-list"></ul>
  </div>;
}
