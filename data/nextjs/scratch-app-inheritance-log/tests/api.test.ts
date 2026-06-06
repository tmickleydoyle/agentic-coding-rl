import { describe, it, expect, beforeEach } from "vitest";
import { __reset } from "../lib/store";
import { GET } from "../app/api/inheritance/route";

describe("GET /api/inheritance", () => {
  beforeEach(() => __reset());

  it("returns entry count", async () => {
    const res = await GET(new Request("http://localhost/api/inheritance"));
    const data = await res.json() as { entryCount: number; totalAmount: number; heirCount: number };
    expect(data.entryCount).toBe(3);
  });

  it("returns total amount", async () => {
    const res = await GET(new Request("http://localhost/api/inheritance"));
    const data = await res.json() as { entryCount: number; totalAmount: number; heirCount: number };
    expect(data.totalAmount).toBe(100000);
  });

  it("returns heir count", async () => {
    const res = await GET(new Request("http://localhost/api/inheritance"));
    const data = await res.json() as { entryCount: number; totalAmount: number; heirCount: number };
    expect(data.heirCount).toBe(3);
  });
});
