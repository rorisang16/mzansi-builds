import request from 'supertest';
import app from '../src/app.js';

describe("Auth API", () => {
  let token;

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "william",
        email: "william@example.com",
        password: "Password123",
        confirmPassword: "Password123"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("william@example.com");
  });

  it("should login the user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "william@example.com",
        password: "Password123"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should change the password", async () => {
    const res = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        currentPassword: "Password123",
        newPassword: "NewPassword456",
        confirmPassword: "NewPassword456"
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});