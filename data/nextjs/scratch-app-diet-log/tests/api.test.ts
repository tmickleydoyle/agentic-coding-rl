import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/entries/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/entries", () => {
  it("returns 4 seed entries", async () => {
    const res = await GET(new Request("http://localhost/api/entries"));
    const data = await res.json();
    expect(data.entries.length).toBe(4);
  });
});

describe("POST /api/entries", () => {
  it("creates entry with status 201", async () => {
    const req = new Request("http://localhost/api/entries", {
      method: "POST",
      body: JSON.stringify({ date: "2024-03-15", mealType: "snack", foodName: "Banana", calories: 105, protein: 1, carbs: 27, fat: 0, servings: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.foodName).toBe("Banana");
  });

  it("increments entry count", async () => {
    const req = new Request("http://localhost/api/entries", {
      method: "POST",
      body: JSON.stringify({ date: "2024-03-15", mealType: "breakfast", foodName: "Toast", calories: 80, protein: 2, carbs: 15, fat: 1, servings: 1 }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/entries"));
    const data = await res.json();
    expect(data.entries.length).toBe(5);
  });
});
