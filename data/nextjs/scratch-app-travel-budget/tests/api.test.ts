import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/expenses/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/expenses", () => {
  it("returns expenses and budget", async () => {
    const res = GET();
    const data = await res.json();
    expect(data.expenses.length).toBe(5);
    expect(data.budget.totalBudget).toBe(3000);
  });
});

describe("POST /api/expenses", () => {
  it("creates expense with 201", async () => {
    const req = new Request("http://localhost/api/expenses", {
      method: "POST",
      body: JSON.stringify({ date: "2024-03-18", description: "Museum", category: "Activities", amount: 10, currency: "JPY", originalAmount: 1470 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.description).toBe("Museum");
  });

  it("count grows after POST", async () => {
    const req = new Request("http://localhost/api/expenses", {
      method: "POST",
      body: JSON.stringify({ date: "2024-03-18", description: "Museum", category: "Activities", amount: 10, currency: "JPY", originalAmount: 1470 }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.expenses.length).toBe(6);
  });
});
