'use client'
import React from 'react';
export function DecksPage() {
  return (
    <main data-testid="decks-page">
      <h2>Decks</h2>
      <div data-testid="add-deck-form">
        <input data-testid="deck-name-input" placeholder="Deck name" />
        <input data-testid="deck-desc-input" placeholder="Description" />
        <button data-testid="add-deck-btn">Add Deck</button>
      </div>
      <ul data-testid="decks-list" />
      <div data-testid="add-card-form">
        <select data-testid="card-deck-select"><option value="">-- Select Deck --</option></select>
        <input data-testid="card-front-input" placeholder="Front" />
        <input data-testid="card-back-input" placeholder="Back" />
        <button data-testid="add-card-btn">Add Card</button>
      </div>
      <ul data-testid="cards-list" />
    </main>
  );
}
