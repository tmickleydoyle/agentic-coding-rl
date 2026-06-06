import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/visas/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/visas", () => {
  it("returns 4 seed visas", async () => {
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(4);
  });
});

describe("POST /api/visas", () => {
  it("creates a visa with 201", async () => {
    const req = new Request("http://localhost/api/visas", {
      method: "POST",
      body: JSON.stringify({ country: "Brazil", visaType: "Tourist", appliedDate: "2024-06-01", expiryDate: "2024-09-01", status: "applied", passportNumber: "C1111111", notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.country).toBe("Brazil");
  });

  it("count grows after POST", async () => {
    const req = new Request("http://localhost/api/visas", {
      method: "POST",
      body: JSON.stringify({ country: "Brazil", visaType: "Tourist", appliedDate: "2024-06-01", expiryDate: "2024-09-01", status: "applied", passportNumber: "C1111111", notes: "" }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(5);
  });
});
