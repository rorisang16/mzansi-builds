
 // Auth API Tests — uses Jest ESM mocking to avoid needing a real database.
 
 //jest.unstable_mockModule must be called BEFORE the app is imported.
 // All subsequent imports of the mocked modules must be dynamic (await import()).
 
import { jest, describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import request from 'supertest';

//Mock userRepository 
const mockUserRepo = {
  getByEmail:      jest.fn(),
  getByUsername:   jest.fn(),
  create:          jest.fn(),
  getById:         jest.fn(),
  updatePassword:  jest.fn(),
};
jest.unstable_mockModule('../src/repositories/userRepository.js', () => ({
  default: mockUserRepo,
}));

//  Mock bcrypt 
const mockBcrypt = {
  hash:    jest.fn(),
  compare: jest.fn(),
};
jest.unstable_mockModule('bcrypt', () => ({
  default: mockBcrypt,
  hash:    mockBcrypt.hash,
  compare: mockBcrypt.compare,
}));

//Loads env vars before importing the app so JWT_SECRET is available 
// authController.js captures JWT_SECRET at module load time.
// The dynamic await import('../src/app.js') below correctly picks this up.
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing_only';
process.env.JWT_EXPIRES_IN = '1d';

// Dynamic imports after mocks are set up 
const { default: app } = await import('../src/app.js');
const { default: jwt } = await import('jsonwebtoken');



describe("Auth API", () => {
  let token;

  // Registered user fixture
  const registeredUser = {
    id: 1,
    username: 'william',
    email: 'william@example.com',
    password: '$2b$10$hashedPasswordHash',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // bcrypt defaults
    mockBcrypt.hash.mockResolvedValue(registeredUser.password);
    mockBcrypt.compare.mockResolvedValue(true);

    // userRepository defaults (can be overridden per test)
    mockUserRepo.getByEmail.mockResolvedValue(null);
    mockUserRepo.getByUsername.mockResolvedValue(null);
    mockUserRepo.create.mockResolvedValue(registeredUser);
    mockUserRepo.getById.mockResolvedValue(registeredUser);
    mockUserRepo.updatePassword.mockResolvedValue(undefined);
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "william",
        email: "william@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("william@example.com");
  });

  it("should login the user", async () => {
    // Simulate existing user found in DB
    mockUserRepo.getByEmail.mockResolvedValue(registeredUser);

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "william@example.com",
        password: "Password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should change the password", async () => {
    // Generate a valid JWT so the authenticate middleware passes
    const testToken = jwt.sign(
      { userId: registeredUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post("/api/auth/change-password")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        currentPassword: "Password123",
        newPassword: "NewPassword456",
        confirmPassword: "NewPassword456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});