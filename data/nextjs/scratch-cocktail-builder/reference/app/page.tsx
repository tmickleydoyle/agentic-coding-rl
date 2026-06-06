import { useState } from "react";

type Category = "Classic" | "Modern";

interface Cocktail {
  id: number;
  name: string;
  category: Category;
  ingredients: string[];
  instructions: string;
}

const SEED_COCKTAILS: Cocktail[] = [
  {
    id: 1,
    name: "Margarita",
    category: "Classic",
    ingredients: ["Tequila (2 oz)", "Triple Sec (1 oz)", "Lime juice (1 oz)", "Salt (pinch)"],
    instructions:
      "Rim glass with salt. Combine tequila, triple sec, and lime juice with ice. Shake well. Strain into glass.",
  },
  {
    id: 2,
    name: "Old Fashioned",
    category: "Classic",
    ingredients: ["Bourbon (2 oz)", "Sugar (1 tsp)", "Angostura bitters (2 dashes)", "Orange peel (1)"],
    instructions:
      "Muddle sugar with bitters. Add bourbon and ice. Stir gently. Garnish with orange peel.",
  },
  {
    id: 3,
    name: "Aperol Spritz",
    category: "Modern",
    ingredients: ["Aperol (3 oz)", "Prosecco (2 oz)", "Soda water (splash)", "Orange slice (1)"],
    instructions:
      "Fill glass with ice. Add Aperol and Prosecco. Top with soda water. Garnish with orange.",
  },
];

type FilterCat = "All" | Category;

export default function App() {
  const [cocktails, setCocktails] = useState<Cocktail[]>(SEED_COCKTAILS);
  const [filter, setFilter] = useState<FilterCat>("All");

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>("Classic");
  const [ingredientInput, setIngredientInput] = useState("");
  const [pendingIngredients, setPendingIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");

  const handleAddIngredient = () => {
    if (!ingredientInput.trim()) return;
    setPendingIngredients((prev) => [...prev, ingredientInput.trim()]);
    setIngredientInput("");
  };

  const handleRemoveIngredient = (index: number) => {
    setPendingIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || pendingIngredients.length === 0) return;
    const newCocktail: Cocktail = {
      id: Date.now(),
      name: name.trim(),
      category,
      ingredients: pendingIngredients,
      instructions: instructions.trim(),
    };
    setCocktails((prev) => [...prev, newCocktail]);
    setName("");
    setCategory("Classic");
    setPendingIngredients([]);
    setIngredientInput("");
    setInstructions("");
  };

  const visible =
    filter === "All" ? cocktails : cocktails.filter((c) => c.category === filter);

  return (
    <div>
      <h1>Cocktail Builder</h1>

      <div>
        <button
          data-testid="filter-all"
          aria-pressed={filter === "All"}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          data-testid="filter-classic"
          aria-pressed={filter === "Classic"}
          onClick={() => setFilter("Classic")}
        >
          Classic
        </button>
        <button
          data-testid="filter-modern"
          aria-pressed={filter === "Modern"}
          onClick={() => setFilter("Modern")}
        >
          Modern
        </button>
      </div>

      <div data-testid="cocktail-list">
        {visible.map((c) => (
          <div key={c.id} data-testid="cocktail-card">
            <span data-testid="cocktail-name">{c.name}</span>
            <span data-testid="cocktail-category">{c.category}</span>
            <ul data-testid="cocktail-ingredients">
              {c.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
            <p data-testid="cocktail-instructions">{c.instructions}</p>
          </div>
        ))}
      </div>

      <div>
        <label>
          Name
          <input
            data-testid="input-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Category
          <select
            data-testid="input-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="Classic">Classic</option>
            <option value="Modern">Modern</option>
          </select>
        </label>
        <div>
          <input
            data-testid="input-ingredient"
            value={ingredientInput}
            onChange={(e) => setIngredientInput(e.target.value)}
            placeholder="Add ingredient"
          />
          <button data-testid="add-ingredient" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
        </div>
        <div data-testid="ingredient-list">
          {pendingIngredients.map((ing, i) => (
            <div key={i} data-testid="ingredient-item">
              {ing}
              <button
                data-testid="remove-ingredient"
                onClick={() => handleRemoveIngredient(i)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <label>
          Instructions
          <textarea
            data-testid="input-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </label>
        <button data-testid="submit-cocktail" onClick={handleSave}>
          Save Cocktail
        </button>
      </div>
    </div>
  );
}
