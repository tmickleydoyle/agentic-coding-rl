import React, { createContext, useContext, useState, useCallback } from "react";
import { WikiPage, WikiCategory } from "../lib/types";

interface AppContextValue {
  route: string;
  navigate: (r: string) => void;
  pages: WikiPage[];
  categories: WikiCategory[];
  setPages: (v: WikiPage[]) => void;
  setCategories: (v: WikiCategory[]) => void;
}

const AppContext = createContext<AppContextValue>({
  route: "/",
  navigate: () => {},
  pages: [],
  categories: [],
  setPages: () => {},
  setCategories: () => {},
});

export function useApp() { return useContext(AppContext); }

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState("/");
  const [pages, setPages] = useState<WikiPage[]>([
    { id: "1", title: "Engineering Onboarding", content: "Welcome to engineering. Setup your local environment...", category: "Engineering", author: "Alice", tags: ["onboarding", "setup"], createdAt: "2024-01-10" },
    { id: "2", title: "Product Roadmap Process", content: "How we plan our product roadmap quarterly...", category: "Product", author: "Bob", tags: ["process", "roadmap"], createdAt: "2024-01-12" },
    { id: "3", title: "Design System Guide", content: "Our design tokens, components, and guidelines...", category: "Design", author: "Carol", tags: ["design", "ui"], createdAt: "2024-01-15" },
    { id: "4", title: "Team Norms", content: "How we work together, communicate, and make decisions...", category: "Culture", author: "Dan", tags: ["culture", "norms"], createdAt: "2024-01-18" },
  ]);
  const [categories, setCategories] = useState<WikiCategory[]>([
    { id: "1", name: "Engineering" },
    { id: "2", name: "Product" },
    { id: "3", name: "Design" },
    { id: "4", name: "Operations" },
    { id: "5", name: "Culture" },
  ]);
  const navigate = useCallback((r: string) => setRoute(r), []);

  return (
    <AppContext.Provider value={{ route, navigate, pages, categories, setPages, setCategories }}>
      {children}
    </AppContext.Provider>
  );
}
