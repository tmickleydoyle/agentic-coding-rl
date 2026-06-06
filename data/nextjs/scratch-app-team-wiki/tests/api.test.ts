import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/pages/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Pages API", () => {
  it("GET returns all seed pages", async () => {
    const res = await GET(new Request("http://localhost/api/pages"));
    const data = await res.json();
    expect(data.length).toBe(4);
  });

  it("GET with query searches pages", async () => {
    const res = await GET(new Request("http://localhost/api/pages?q=design"));
    const data = await res.json();
    expect(data.length).toBe(1);
    expect(data[0].title).toBe("Design System Guide");
  });

  it("POST creates page", async () => {
    const res = await POST(
      new Request("http://localhost/api/pages", {
        method: "POST",
        body: JSON.stringify({ title: "New Policy", content: "...", category: "Operations", author: "Eve", tags: [] }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("New Policy");
  });

  it("POST rejects duplicate title", async () => {
    const res = await POST(
      new Request("http://localhost/api/pages", {
        method: "POST",
        body: JSON.stringify({ title: "Team Norms", content: "", category: "Culture", author: "Eve", tags: [] }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("DELETE removes page", async () => {
    await DELETE(new Request("http://localhost/api/pages?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/pages"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});
