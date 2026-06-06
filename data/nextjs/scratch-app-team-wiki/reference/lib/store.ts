import { WikiPage, WikiCategory } from "./types";

const SEED_PAGES: WikiPage[] = [
  { id: "1", title: "Engineering Onboarding", content: "Welcome to engineering. Setup your local environment...", category: "Engineering", author: "Alice", tags: ["onboarding", "setup"], createdAt: "2024-01-10" },
  { id: "2", title: "Product Roadmap Process", content: "How we plan our product roadmap quarterly...", category: "Product", author: "Bob", tags: ["process", "roadmap"], createdAt: "2024-01-12" },
  { id: "3", title: "Design System Guide", content: "Our design tokens, components, and guidelines...", category: "Design", author: "Carol", tags: ["design", "ui"], createdAt: "2024-01-15" },
  { id: "4", title: "Team Norms", content: "How we work together, communicate, and make decisions...", category: "Culture", author: "Dan", tags: ["culture", "norms"], createdAt: "2024-01-18" },
];

const SEED_CATEGORIES: WikiCategory[] = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Product" },
  { id: "3", name: "Design" },
  { id: "4", name: "Operations" },
  { id: "5", name: "Culture" },
];

let pages: WikiPage[] = SEED_PAGES.map((p) => ({ ...p, tags: [...p.tags] }));
let categories: WikiCategory[] = SEED_CATEGORIES.map((c) => ({ ...c }));
let nextPageId = 5;
let nextCategoryId = 6;

export function getPages(): WikiPage[] { return pages.map((p) => ({ ...p, tags: [...p.tags] })); }

export function addPage(data: Omit<WikiPage, "id">): WikiPage | { error: string } {
  if (pages.some((p) => p.title.toLowerCase() === data.title.toLowerCase())) {
    return { error: "Title already exists" };
  }
  const p: WikiPage = { ...data, id: String(nextPageId++), tags: [...data.tags] };
  pages.push(p);
  return { ...p, tags: [...p.tags] };
}

export function updatePage(id: string, data: Partial<Omit<WikiPage, "id">>): WikiPage | null {
  const idx = pages.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  pages[idx] = { ...pages[idx], ...data, tags: data.tags ? [...data.tags] : pages[idx].tags };
  return { ...pages[idx], tags: [...pages[idx].tags] };
}

export function deletePage(id: string): boolean {
  const idx = pages.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  pages.splice(idx, 1);
  return true;
}

export function getCategories(): WikiCategory[] { return categories.map((c) => ({ ...c })); }

export function addCategory(name: string): WikiCategory {
  const c: WikiCategory = { id: String(nextCategoryId++), name };
  categories.push(c);
  return { ...c };
}

export function deleteCategory(id: string): { success: boolean; error?: string } {
  const cat = categories.find((c) => c.id === id);
  if (!cat) return { success: false, error: "Not found" };
  if (pages.some((p) => p.category === cat.name)) return { success: false, error: "Category in use" };
  categories = categories.filter((c) => c.id !== id);
  return { success: true };
}

export function searchPages(query: string): WikiPage[] {
  if (!query.trim()) return pages.map((p) => ({ ...p, tags: [...p.tags] }));
  const q = query.toLowerCase();
  return pages
    .filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q))
    .map((p) => ({ ...p, tags: [...p.tags] }));
}

export function __reset(): void {
  pages = SEED_PAGES.map((p) => ({ ...p, tags: [...p.tags] }));
  categories = SEED_CATEGORIES.map((c) => ({ ...c }));
  nextPageId = 5;
  nextCategoryId = 6;
}
