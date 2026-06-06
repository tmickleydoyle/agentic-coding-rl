import { describe, it, expect, beforeEach } from "vitest";
import { __reset } from "../lib/store";
import { POST } from "../app/api/beneficiary/route";

describe("POST /api/beneficiary", () => {
  beforeEach(() => __reset());

  it("returns report array", async () => {
    const req = new Request("http://localhost/api/beneficiary", {
      method: "POST",
      body: JSON.stringify({ action: "report" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const data = await res.json() as Array<{ name: string; total: number }>;
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });

  it("Alice Chen total is 90", async () => {
    const req = new Request("http://localhost/api/beneficiary", {
      method: "POST",
      body: JSON.stringify({ action: "report" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const data = await res.json() as Array<{ name: string; total: number }>;
    const alice = data.find((d) => d.name === "Alice Chen");
    expect(alice?.total).toBe(90);
  });

  it("returns 400 for unknown action", async () => {
    const req = new Request("http://localhost/api/beneficiary", {
      method: "POST",
      body: JSON.stringify({ action: "bad" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
