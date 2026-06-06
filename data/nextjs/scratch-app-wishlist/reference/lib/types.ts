export type Priority = "low" | "medium" | "high";

export interface WishItem {
  id: string;
  name: string;
  price: number;
  url: string;
  category: string;
  priority: Priority;
  purchased: boolean;
  addedAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export type Route = "/" | "/items" | "/categories" | "/shared";
