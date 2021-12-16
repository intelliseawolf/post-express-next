import bcrypt from "bcryptjs";

import prismaMock from "../prisma-mock";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../../src/services/post.service";

describe("PostService", () => {
  describe("createPost", () => {
    test("should create a post", async () => {
      const post = {
        title: "title",
        content: "description",
      };
      const mockedResponse = {
        id: 123,
        title: "title",
        content: "description",
        userId: 1,
      };

      prismaMock.post.create.mockResolvedValue(mockedResponse);

      await expect(createPost(post, "1")).resolves.toEqual(mockedResponse);
    });
  });

  describe("getPosts", () => {
    test("should get posts", async () => {
      const query = {
        perPage: 1,
        page: 0,
      };
      const mockedResponse = [
        {
          id: 123,
          title: "title",
          content: "description",
          userId: 1,
        },
      ];

      prismaMock.post.findMany.mockResolvedValue(mockedResponse);

      await expect(getPosts(query, "1")).resolves.toHaveLength(1);
    });
  });

  describe("getPost", () => {
    test("should get a post", async () => {
      const mockedResponse = {
        id: 123,
        title: "title",
        content: "description",
        userId: 1,
      };

      prismaMock.post.findUnique.mockResolvedValue(mockedResponse);

      await expect(getPost("1")).resolves.toEqual(mockedResponse);
    });
  });

  describe("updatePost", () => {
    test("should update a post", async () => {
      const post = {
        title: "title",
        content: "content",
      };
      const mockedResponse = {
        id: 123,
        title: "title",
        content: "description",
        userId: 1,
      };

      prismaMock.post.update.mockResolvedValue(mockedResponse);

      await expect(updatePost(post, "1")).resolves.toEqual(mockedResponse);
    });
  });

  describe("deletePost", () => {
    test("should delete a post", async () => {
      const mockedResponse = {
        id: 123,
        title: "title",
        content: "description",
        userId: 1,
      };

      prismaMock.post.delete.mockResolvedValue(mockedResponse);

      await expect(deletePost("1")).resolves.toEqual(mockedResponse);
    });
  });
});
