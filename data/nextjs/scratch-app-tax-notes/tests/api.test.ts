import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/tax/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Tax API", () => {
  it("GET returns documents", async () => {
    const data = await (await GET(new Request("http://localhost/api/tax"))).json();
    expect(data.data.length).toBe(2);
  });
  it("GET returns deductions", async () => {
    const data = await (await GET(new Request("http://localhost/api/tax?type=deductions"))).json();
    expect(data.data.length).toBe(3);
  });
  it("GET returns notes", async () => {
    const data = await (await GET(new Request("http://localhost/api/tax?type=notes"))).json();
    expect(data.data.length).toBe(1);
  });
  it("POST adds document", async () => {
    const res = await POST(new Request("http://localhost/api/tax", {
      method: "POST",
      body: JSON.stringify({ id: "d99", name: "Test W2", type: "w2", year: 2023, amount: 50000 }),
    }));
    expect(res.status).toBe(201);
  });
  it("DELETE removes document", async () => {
    await DELETE(new Request("http://localhost/api/tax?id=doc1", { method: "DELETE" }));
    const data = await (await GET(new Request("http://localhost/api/tax"))).json();
    expect(data.data.length).toBe(1);
  });
});
