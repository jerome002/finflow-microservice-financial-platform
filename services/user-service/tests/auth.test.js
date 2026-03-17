import request from "supertest";
import app from "../src/server.js"; // Adjust path if needed

describe("User Service", () => {
  it("should register a user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password123"
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toContain("registered");
  });

  it("should login a user", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "test@example.com",
        password: "password123"
      });
    expect(response.status).toBe(400); // Since email not verified
    expect(response.body.error).toContain("verify");
  });
});