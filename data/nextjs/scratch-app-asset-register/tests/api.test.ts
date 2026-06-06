import { describe, it, expect, beforeEach } from "vitest";
import { __reset } from "../lib/store";
import { GET } from "../app/api/assets/route";

describe("GET /api/assets", () => {
  beforeEach(() => __reset());

  it("returns asset count", async () => {
    const res = await GET(new Request("http://localhost/api/assets"));
    const data = await res.json() as { assetCount: number; valuationCount: number; totalValue: number };
    expect(data.assetCount).toBe(3);
  });

  it("returns valuation count", async () => {
    const res = await GET(new Request("http://localhost/api/assets"));
    const data = await res.json() as { assetCount: number; valuationCount: number; totalValue: number };
    expect(data.valuationCount).toBe(4);
  });

  it("returns total value using latest per asset", async () => {
    const res = await GET(new Request("http://localhost/api/assets"));
    const data = await res.json() as { assetCount: number; valuationCount: number; totalValue: number };
    expect(data.totalValue).toBe(580000);
  });
});
