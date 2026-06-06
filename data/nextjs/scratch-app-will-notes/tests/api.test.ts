import { describe, it, expect, beforeEach } from "vitest";
import { __reset } from "../lib/store";
import { GET } from "../app/api/will/route";

describe("GET /api/will", () => {
  beforeEach(() => __reset());

  it("returns clause count", async () => {
    const req = new Request("http://localhost/api/will");
    const res = await GET(req);
    const data = await res.json() as { clauseCount: number; signedCount: number; pendingCount: number; complete: boolean };
    expect(data.clauseCount).toBe(2);
  });

  it("returns signed and pending counts", async () => {
    const req = new Request("http://localhost/api/will");
    const res = await GET(req);
    const data = await res.json() as { clauseCount: number; signedCount: number; pendingCount: number; complete: boolean };
    expect(data.signedCount).toBe(1);
    expect(data.pendingCount).toBe(1);
  });

  it("returns complete=false by default", async () => {
    const req = new Request("http://localhost/api/will");
    const res = await GET(req);
    const data = await res.json() as { clauseCount: number; signedCount: number; pendingCount: number; complete: boolean };
    expect(data.complete).toBe(false);
  });
});
