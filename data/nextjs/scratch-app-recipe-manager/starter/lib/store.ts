import { Recipe } from "./types";

export function getRecipes(): Recipe[] {
  return [];
}

export function addRecipe(_data: Omit<Recipe, "id" | "createdAt">): Recipe {
  return { id: "", name: "", ingredients: "", instructions: "", category: "breakfast", createdAt: "" };
}

export function deleteRecipe(_id: string): void {}

export function __reset(): void {}
