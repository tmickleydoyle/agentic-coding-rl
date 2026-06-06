export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  prepTime: number;
  ingredients: string[];
  instructions: string;
  favorite: boolean;
}

export type Route = 'home' | 'recipes' | 'ingredients' | 'favorites';
