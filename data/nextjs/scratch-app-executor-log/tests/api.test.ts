import { describe, it, expect, beforeEach } from "vitest";
import { __reset } from "../lib/store";
import { GET } from "../app/api/executor/route";

describe("GET /api/executor", () => {
  beforeEach(() => __reset());

  it("returns total task count", async () => {
    const res = await GET(new Request("http://localhost/api/executor"));
    const data = await res.json() as { total: number; done: number; overdue: number };
    expect(data.total).toBe(4);
  });

  it("returns done count", async () => {
    const res = await GET(new Request("http://localhost/api/executor"));
    const data = await res.json() as { total: number; done: number; overdue: number };
    expect(data.done).toBe(1);
  });

  it("returns overdue count (t4 is overdue)", async () => {
    const res = await GET(new Request("http://localhost/api/executor"));
    const data = await res.json() as { total: number; done: number; overdue: number };
    expect(data.overdue).toBe(1);
  });
});
