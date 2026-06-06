import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/calories/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/calories", () => {
  it("returns 3 seed logs", async () => {
    const res = await GET(new Request("http://localhost/api/calories"));
    const data = await res.json();
    expect(data.logs.length).toBe(3);
  });

  it("returns goals", async () => {
    const res = await GET(new Request("http://localhost/api/calories"));
    const data = await res.json();
    expect(data.goals.calories).toBe(2000);
  });
});

describe("POST /api/calories", () => {
  it("creates log entry", async () => {
    const req = new Request("http://localhost/api/calories", {
      method: "POST",
      body: JSON.stringify({ date: "2024-04-10", name: "Salad", calories: 150, protein: 5, carbs: 20, fat: 3 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Salad");
  });
});
