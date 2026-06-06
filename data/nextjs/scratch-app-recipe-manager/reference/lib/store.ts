import { Recipe } from "./types";

const SEED: Recipe[] = [
  {
    id: "r1",
    name: "Pancakes",
    category: "breakfast",
    ingredients: "Flour\nEggs\nMilk\nButter",
    instructions: "Mix and cook on griddle.",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "r2",
    name: "Caesar Salad",
    category: "lunch",
    ingredients: "Romaine\nCroutons\nParmesan\nDressing",
    instructions: "Toss and serve.",
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "r3",
    name: "Spaghetti Bolognese",
    category: "dinner",
    ingredients: "Pasta\nGround Beef\nTomato Sauce\nOnion",
    instructions: "Cook meat, add sauce, serve over pasta.",
    createdAt: "2024-01-03T00:00:00.000Z",
  },
];

let recipes: Recipe[] = SEED.map((r) => ({ ...r }));
let nextId = 4;

export function getRecipes(): Recipe[] {
  return recipes;
}

export function addRecipe(
  data: Omit<Recipe, "id" | "createdAt">
): Recipe {
  const recipe: Recipe = {
    ...data,
    id: `r${nextId++}`,
    createdAt: new Date().toISOString(),
  };
  recipes = [...recipes, recipe];
  return recipe;
}

export function deleteRecipe(id: string): void {
  recipes = recipes.filter((r) => r.id !== id);
}

export function __reset(): void {
  recipes = SEED.map((r) => ({ ...r }));
  nextId = 4;
}
