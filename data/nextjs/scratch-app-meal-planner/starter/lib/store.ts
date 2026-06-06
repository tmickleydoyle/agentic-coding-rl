import { Recipe } from './types';

export function getRecipes(): Recipe[] { return []; }
export function addRecipe(_name: string, _ingredients: string[], _servings: number, _prepMinutes: number, _tags: string[]): Recipe { throw new Error('Not implemented'); }
export function deleteRecipe(_id: string): void {}
export function __reset(): void {}
