import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/meals/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/meals", () => {
  it("returns 4 seed meals", async () => {
    const res = await GET(new Request("http://localhost/api/meals"));
    const data = await res.json();
    expect(data.meals.length).toBe(4);
  });

  it("returns status 200", async () => {
    const res = await GET(new Request("http://localhost/api/meals"));
    expect(res.status).toBe(200);
  });
});

describe("POST /api/meals", () => {
  it("creates a meal entry", async () => {
    const req = new Request("http://localhost/api/meals", {
      method: "POST",
      body: JSON.stringify({ day: "Tuesday", mealType: "lunch", name: "Sandwich", notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Sandwich");
  });

  it("increments meal count", async () => {
    const req = new Request("http://localhost/api/meals", {
      method: "POST",
      body: JSON.stringify({ day: "Sunday", mealType: "snack", name: "Apple", notes: "" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/meals"));
    const data = await res.json();
    expect(data.meals.length).toBe(5);
  });
});
