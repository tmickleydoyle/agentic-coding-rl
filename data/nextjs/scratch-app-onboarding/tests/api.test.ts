import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/employees/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Employees API", () => {
  it("GET returns seed employees", async () => {
    const res = await GET(new Request("http://localhost/api/employees"));
    const data = await res.json();
    expect(data.length).toBe(2);
  });

  it("POST creates employee", async () => {
    const res = await POST(
      new Request("http://localhost/api/employees", {
        method: "POST",
        body: JSON.stringify({ name: "George", email: "george@co.com", department: "Sales", startDate: "2024-03-01" }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("George");
  });

  it("POST rejects invalid email", async () => {
    const res = await POST(
      new Request("http://localhost/api/employees", {
        method: "POST",
        body: JSON.stringify({ name: "George", email: "notvalid", department: "Sales", startDate: "2024-03-01" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("POST rejects missing startDate", async () => {
    const res = await POST(
      new Request("http://localhost/api/employees", {
        method: "POST",
        body: JSON.stringify({ name: "George", email: "george@co.com", department: "Sales" }),
      })
    );
    expect(res.status).toBe(400);
  });
});
