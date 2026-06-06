import type { Recipe } from './types';

const seed: Recipe[] = [
  { id: 'r1', title: 'Pasta Carbonara', cuisine: 'Italian', prepTime: 20, ingredients: ['pasta', 'eggs', 'bacon', 'parmesan'], instructions: 'Boil pasta...', favorite: true },
  { id: 'r2', title: 'Chicken Stir Fry', cuisine: 'Asian', prepTime: 15, ingredients: ['chicken', 'broccoli', 'soy sauce', 'ginger'], instructions: 'Heat oil...', favorite: false },
  { id: 'r3', title: 'Caesar Salad', cuisine: 'American', prepTime: 10, ingredients: ['lettuce', 'croutons', 'parmesan', 'caesar dressing'], instructions: 'Toss greens...', favorite: true },
];

let recipes: Recipe[] = seed.map(r => ({ ...r, ingredients: [...r.ingredients] }));
let nextId = 4;

export function __reset() {
  recipes = seed.map(r => ({ ...r, ingredients: [...r.ingredients] }));
  nextId = 4;
}

export function getRecipes(): Recipe[] { return recipes.slice(); }

export function addRecipe(data: Omit<Recipe, 'id'>): Recipe {
  const r: Recipe = { id: `r${nextId++}`, ...data };
  recipes.push(r);
  return r;
}

export function toggleFavorite(id: string): boolean {
  const r = recipes.find(r => r.id === id);
  if (!r) return false;
  r.favorite = !r.favorite;
  return true;
}

export function getIngredients(): string[] {
  const set = new Set<string>();
  recipes.forEach(r => r.ingredients.forEach(i => set.add(i)));
  return Array.from(set).sort();
}
