import type { Recipe } from './types';

export function __reset() {}
export function getRecipes(): Recipe[] { return []; }
export function addRecipe(_data: Omit<Recipe, 'id'>): Recipe { return { id: '', title: '', cuisine: '', prepTime: 0, ingredients: [], instructions: '', favorite: false }; }
export function toggleFavorite(_id: string): boolean { return false; }
export function getIngredients(): string[] { return []; }
