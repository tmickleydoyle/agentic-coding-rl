import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/exchanges/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/exchanges", () => {
  it("returns seed data", async () => {
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe("POST /api/exchanges", () => {
  it("creates exchange with 201", async () => {
    const req = new Request("http://localhost/api/exchanges", {
      method: "POST",
      body: JSON.stringify({ date: "2024-06-01", fromCurrency: "CAD", toCurrency: "MXN", amountFrom: 100, amountTo: 1350, location: "Mexico City", fee: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.toCurrency).toBe("MXN");
  });

  it("grows count after POST", async () => {
    const req = new Request("http://localhost/api/exchanges", {
      method: "POST",
      body: JSON.stringify({ date: "2024-06-01", fromCurrency: "CAD", toCurrency: "MXN", amountFrom: 100, amountTo: 1350, location: "Mexico City", fee: 1 }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});
