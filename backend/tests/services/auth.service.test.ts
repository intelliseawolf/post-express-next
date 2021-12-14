import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import prismaMock from "../prisma-mock";
import { login, register } from "../../src/services/auth.service";

describe("AuthService", () => {
  describe("login", () => {
    test("should return a token", async () => {
      const user = {
        email: "admin@gmail.com",
        password: "123123",
      };
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const mockedResponse = {
        id: 123,
        email: "admin@gmail.com",
        password: hashedPassword,
        firstname: "admin",
        lastname: "super",
        status: true,
        role: "admin" as Role,
      };

      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      await expect(login(user)).resolves.toHaveProperty("token");
    });

    test("throw an error if the password is wrong", async () => {
      const user = {
        email: "admin@gmail.com",
        password: "123123",
      };
      const hashedPassword = await bcrypt.hash("321321", 10);
      const mockedResponse = {
        id: 123,
        email: "admin@gmail.com",
        password: hashedPassword,
        firstname: "admin",
        lastname: "super",
        status: true,
        role: "admin" as Role,
      };

      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      const error = String({ errors: { "email or password": ["is invalid"] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test("throw an error if the user is not approved", async () => {
      const user = {
        email: "admin@gmail.com",
        password: "123123",
      };
      const hashedPassword = await bcrypt.hash("123123", 10);
      const mockedResponse = {
        id: 123,
        email: "admin@gmail.com",
        password: hashedPassword,
        firstname: "admin",
        lastname: "super",
        status: false,
        role: "admin" as Role,
      };

      prismaMock.user.findUnique.mockResolvedValue(mockedResponse);

      await expect(login(user)).rejects.toThrowError();
    });
  });

  describe("register", () => {
    test("should register a user", async () => {
      const user = {
        email: "admin@gmail.com",
        password: "123123",
        firstname: "admin",
        lastname: "super",
      };
      const hashedPassword = await bcrypt.hash("123123", 10);
      const mockedResponse = {
        id: 123,
        email: "admin@gmail.com",
        password: hashedPassword,
        firstname: "admin",
        lastname: "super",
        status: true,
        role: "admin" as Role,
      };

      prismaMock.user.create.mockResolvedValue(mockedResponse);

      await expect(register(user)).resolves.toEqual(mockedResponse);
    });
  });
});
