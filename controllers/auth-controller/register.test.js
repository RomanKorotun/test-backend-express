import mongoose from "mongoose";
import app from "../../app.js";
import "dotenv/config";
import request from "supertest";
import User from "../../models/User.js";
import bcryptjs from "bcryptjs";

const { TEST_DB_HOST, PORT = 5050 } = process.env;
const SECONDS = 1000;

describe("test api/auth/register", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(PORT);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test(
    "test 'register' with correct status - status(201)",
    async () => {
      const registerData = {
        username: "Roman",
        email: "roman@gmail.com",
        password: "123456",
      };
      const { statusCode } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(statusCode).toBe(201);
    },
    20 * SECONDS
  );
  test(
    "test 'register' - correct process of registering a user in the database",
    async () => {
      const registerData = {
        username: "Roman",
        email: "roman@gmail.com",
        password: "123456",
      };

      const { body } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(body.username).toBe(registerData.username);
      expect(body.email).toBe(registerData.email);

      const user = await User.findOne({ email: registerData.email });
      expect(user.email).toBe(registerData.email);
    },
    20 * SECONDS
  );
  test(
    "test 'register' - user with such an email is already in the database - status(409)",
    async () => {
      const registerData = {
        username: "Roman",
        email: "roman@gmail.com",
        password: "123456",
      };
      await request(app).post("/api/auth/register").send(registerData);
      const { statusCode } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(statusCode).toBe(409);
    },
    20 * SECONDS
  );
  test(
    "test 'register' - required 'username' field is missing - status(400)",
    async () => {
      const registerData = {
        email: "roman@gmail.com",
        password: "123456",
      };
      const { statusCode } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(statusCode).toBe(400);
    },
    20 * SECONDS
  );
  test(
    "test 'register' -  'username' field must be a string. If the format of the field is not a string - status(400)",
    async () => {
      const registerData = {
        username: 123456,
        email: "roman@gmail.com",
        password: "123456",
      };
      const { statusCode } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(statusCode).toBe(400);
    },
    20 * SECONDS
  );
  test(
    "test 'register' - required 'email' field is missing - status(400)",
    async () => {
      const registerData = {
        username: "Roman",
        password: "123456",
      };
      const { statusCode } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(statusCode).toBe(400);
    },
    20 * SECONDS
  );
  test(
    "test 'register' -  'email' field must be a string. If the format of the field is not a string - status(400)",
    async () => {
      const registerData = {
        username: "Roman",
        email: 123456,
        password: "123456",
      };
      const { statusCode } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(statusCode).toBe(400);
    },
    20 * SECONDS
  );
  test(
    "test 'register' -  'email' field must be a string containing the symbol - '@'. If the '@' symbol is missing - status(400)",
    async () => {
      const registerData = {
        username: "Roman",
        email: "romangmail.com",
        password: "123456",
      };
      const { statusCode } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(statusCode).toBe(400);
    },
    20 * SECONDS
  );
  test(
    "test 'register' - required 'password' field is missing - status(400)",
    async () => {
      const registerData = {
        username: "Roman",
        email: "roman@gmail.com",
      };
      const { statusCode } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(statusCode).toBe(400);
    },
    20 * SECONDS
  );
  test(
    "test 'register' -  'password' field must be a string. If the format of the field is not a string - status(400)",
    async () => {
      const registerData = {
        username: "Roman",
        email: "roman@gmail.com",
        password: 123456,
      };
      const { statusCode } = await request(app)
        .post("/api/auth/register")
        .send(registerData);
      expect(statusCode).toBe(400);
    },
    20 * SECONDS
  );
  test(
    "test 'register' -  'password' field must be written to the database in a hashed form",
    async () => {
      const registerData = {
        username: "Roman",
        email: "roman@gmail.com",
        password: "123456",
      };
      await request(app).post("/api/auth/register").send(registerData);
      const user = await User.findOne({ email: registerData.email });
      const hashPasswordCompare = await bcryptjs.compare(
        registerData.password,
        user.password
      );
      expect(hashPasswordCompare).toBe(true);
    },
    20 * SECONDS
  );
  test(
    "test 'register' -  'avatar' field must be written to the database as a string",
    async () => {
      const registerData = {
        username: "Roman",
        email: "roman@gmail.com",
        password: "123456",
      };
      await request(app).post("/api/auth/register").send(registerData);
      const user = await User.findOne({ email: registerData.email });
      expect(typeof user.avatar === "string").toBe(true);
    },
    20 * SECONDS
  );
});
