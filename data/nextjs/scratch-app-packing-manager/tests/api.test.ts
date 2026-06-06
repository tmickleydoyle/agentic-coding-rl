import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/lists/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/lists", () => {
  it("returns 2 seed lists", async () => {
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(2);
  });

  it("lists include items", async () => {
    const res = GET();
    const data = await res.json();
    expect(data[0].items.length).toBe(3);
  });
});

describe("POST /api/lists", () => {
  it("creates list with 201", async () => {
    const req = new Request("http://localhost/api/lists", {
      method: "POST",
      body: JSON.stringify({ tripName: "Thailand", destination: "Bangkok", departureDate: "2024-09-01" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.tripName).toBe("Thailand");
    expect(data.items).toEqual([]);
  });

  it("count grows after POST", async () => {
    const req = new Request("http://localhost/api/lists", {
      method: "POST",
      body: JSON.stringify({ tripName: "Thailand", destination: "Bangkok", departureDate: "2024-09-01" }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});
