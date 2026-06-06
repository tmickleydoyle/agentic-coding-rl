import React from "react";
import { useApp } from "../../components/AppStateProvider";

export function MealDetailPage() {
  const { selectedMeal, handleDelete } = useApp();
  if (!selectedMeal) return <div>No meal selected.</div>;
  return (
    <div>
      <h1 data-testid="detail-name">{selectedMeal.name}</h1>
      <p data-testid="detail-day">{selectedMeal.day}</p>
      <p data-testid="detail-type">{selectedMeal.mealType}</p>
      <p data-testid="detail-notes">{selectedMeal.notes}</p>
      <button data-testid="delete-btn" onClick={() => handleDelete(selectedMeal.id)}>Delete</button>
    </div>
  );
}
