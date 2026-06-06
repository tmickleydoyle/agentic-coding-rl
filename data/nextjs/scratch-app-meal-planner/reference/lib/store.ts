import { Recipe } from './types';

let recipes: Recipe[] = [
  { id: 'rc1', name: 'Oatmeal', ingredients: ['oats', 'milk', 'honey'], servings: 1, prepMinutes: 5, tags: ['breakfast'] },
  { id: 'rc2', name: 'Pasta', ingredients: ['pasta', 'tomato sauce', 'cheese'], servings: 2, prepMinutes: 20, tags: ['dinner'] },
];
let nextId = 3;

export function getRecipes(): Recipe[] { return recipes; }

export function addRecipe(name: string, ingredients: string[], servings: number, prepMinutes: number, tags: string[]): Recipe {
  if (!name.trim()) throw new Error('Name required');
  if (ingredients.length === 0) throw new Error('At least one ingredient required');
  const recipe: Recipe = { id: `rc${nextId++}`, name: name.trim(), ingredients, servings, prepMinutes, tags };
  recipes.push(recipe);
  return recipe;
}

export function deleteRecipe(id: string): void {
  recipes = recipes.filter(r => r.id !== id);
}

export function __reset(): void {
  recipes = [
    { id: 'rc1', name: 'Oatmeal', ingredients: ['oats', 'milk', 'honey'], servings: 1, prepMinutes: 5, tags: ['breakfast'] },
    { id: 'rc2', name: 'Pasta', ingredients: ['pasta', 'tomato sauce', 'cheese'], servings: 2, prepMinutes: 20, tags: ['dinner'] },
  ];
  nextId = 3;
}
