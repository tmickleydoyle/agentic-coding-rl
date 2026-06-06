import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/recipes/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/recipes", () => {
  it("returns 3 seed recipes", async () => {
    const res = await GET(new Request("http://localhost/api/recipes"));
    const data = await res.json();
    expect(data.recipes.length).toBe(3);
  });

  it("returns status 200", async () => {
    const res = await GET(new Request("http://localhost/api/recipes"));
    expect(res.status).toBe(200);
  });
});

describe("POST /api/recipes", () => {
  it("creates a new recipe", async () => {
    const req = new Request("http://localhost/api/recipes", {
      method: "POST",
      body: JSON.stringify({ name: "Waffles", ingredients: "Flour\nEggs", instructions: "Pour and cook.", category: "breakfast" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Waffles");
  });

  it("increments recipe count", async () => {
    const req = new Request("http://localhost/api/recipes", {
      method: "POST",
      body: JSON.stringify({ name: "Toast", ingredients: "Bread", instructions: "Toast it.", category: "breakfast" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/recipes"));
    const data = await res.json();
    expect(data.recipes.length).toBe(4);
  });
});
