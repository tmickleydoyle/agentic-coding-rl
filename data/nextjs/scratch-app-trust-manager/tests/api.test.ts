import { describe, it, expect, beforeEach } from "vitest";
import { __reset } from "../lib/store";
import { GET } from "../app/api/trust/route";

describe("GET /api/trust", () => {
  beforeEach(() => __reset());

  it("returns trust count", async () => {
    const res = await GET(new Request("http://localhost/api/trust"));
    const data = await res.json() as { trustCount: number; totalPrincipal: number; totalDistributed: number };
    expect(data.trustCount).toBe(2);
  });

  it("returns total principal", async () => {
    const res = await GET(new Request("http://localhost/api/trust"));
    const data = await res.json() as { trustCount: number; totalPrincipal: number; totalDistributed: number };
    expect(data.totalPrincipal).toBe(650000);
  });

  it("returns total distributed", async () => {
    const res = await GET(new Request("http://localhost/api/trust"));
    const data = await res.json() as { trustCount: number; totalPrincipal: number; totalDistributed: number };
    expect(data.totalDistributed).toBe(35000);
  });
});
