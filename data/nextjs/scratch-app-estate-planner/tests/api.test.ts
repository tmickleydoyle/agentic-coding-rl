import { describe, it, expect, beforeEach } from "vitest";
import { __reset } from "../lib/store";
import { POST } from "../app/api/estate/route";

describe("API /api/estate", () => {
  beforeEach(() => __reset());

  it("returns summary with totalValue", async () => {
    const req = new Request("http://localhost/api/estate", {
      method: "POST",
      body: JSON.stringify({ action: "summary" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const data = await res.json() as { totalValue: number; assetCount: number; beneficiaryCount: number };
    expect(data.totalValue).toBe(600000);
  });

  it("returns correct asset count", async () => {
    const req = new Request("http://localhost/api/estate", {
      method: "POST",
      body: JSON.stringify({ action: "summary" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const data = await res.json() as { totalValue: number; assetCount: number; beneficiaryCount: number };
    expect(data.assetCount).toBe(3);
    expect(data.beneficiaryCount).toBe(2);
  });

  it("returns 400 for unknown action", async () => {
    const req = new Request("http://localhost/api/estate", {
      method: "POST",
      body: JSON.stringify({ action: "unknown" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
