import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/trips/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/trips", () => {
  it("returns 3 seed trips", async () => {
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe("POST /api/trips", () => {
  it("creates a new trip", async () => {
    const req = new Request("http://localhost/api/trips", {
      method: "POST",
      body: JSON.stringify({ name: "Iceland", destination: "Reykjavik", startDate: "2025-01-10", endDate: "2025-01-17", status: "planned", notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Iceland");
  });

  it("total trips grows after POST", async () => {
    const req = new Request("http://localhost/api/trips", {
      method: "POST",
      body: JSON.stringify({ name: "Iceland", destination: "Reykjavik", startDate: "2025-01-10", endDate: "2025-01-17", status: "planned", notes: "" }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});
