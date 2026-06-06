export interface Recipe { id: string; name: string; ingredients: string[]; servings: number; prepMinutes: number; tags: string[]; }
export interface PlanEntry { id: string; day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'; recipeId: string; mealType: 'breakfast' | 'lunch' | 'dinner'; }
export interface ShoppingItem { id: string; name: string; checked: boolean; custom: boolean; }
export type Route = 'home' | 'recipes' | 'planner' | 'shopping';
