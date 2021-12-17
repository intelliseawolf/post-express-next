import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import prismaMock from "../prisma-mock";
import {
  createUser,
  deleteUser,
  getUsers,
  toggleUserStatus,
  updateUser,
} from "../../src/services/user.service";

describe("UserService", () => {
  describe("createUser", () => {
    test("should create a user", async () => {
      const user = {
        email: "admin@gmail.com",
        password: "123123",
        firstname: "admin",
        lastname: "super",
        role: "admin" as Role,
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

      await expect(createUser(user)).resolves.toEqual(mockedResponse);
    });
  });

  describe("getUsers", () => {
    test("should get users", async () => {
      const query = {
        perPage: 1,
        page: 0,
      };
      const mockedResponse = [
        {
          id: 123,
          email: "admin@gmail.com",
          password: "123123",
          firstname: "admin",
          lastname: "super",
          status: true,
          role: "admin" as Role,
        },
      ];

      prismaMock.user.findMany.mockResolvedValue(mockedResponse);

      await expect(getUsers(query)).resolves.toHaveLength(1);
    });
  });

  describe("updateUser", () => {
    test("should update a user", async () => {
      const user = {
        firstname: "admin",
        lastname: "super",
        role: "admin" as Role,
        status: true,
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

      prismaMock.user.update.mockResolvedValue(mockedResponse);

      await expect(updateUser(1, user)).resolves.toEqual(mockedResponse);
    });
  });

  describe("deleteUser", () => {
    test("should delete a user", async () => {
      const id = 1;
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

      prismaMock.user.delete.mockResolvedValue(mockedResponse);

      await expect(deleteUser(1)).resolves.toEqual(mockedResponse);
    });
  });

  describe("toggleUserStatus", () => {
    test("should toggle user's status", async () => {
      const id = 1;
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

      prismaMock.user.findUnique.mockResolvedValue({
        ...mockedResponse,
        status: false,
      });
      prismaMock.user.update.mockResolvedValue(mockedResponse);

      await expect(toggleUserStatus(1)).resolves.toEqual(mockedResponse);
    });
  });

  test("should throw error if cannot find a user", async () => {
    const id = 1;

    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(toggleUserStatus(1)).rejects.toThrowError();
  });
});
