import { Request, Response } from "express";
import * as cloudinaryUploads from "@global/helpers/cloudinary-upload";
import { authMockRequest, authMockResponse } from "@root/mocks/auth.mock";

import { CustomError } from "@global/helpers/error-handler";
import { signupSchema } from "@auth/schemes/signup";
import { Signup } from "@auth/controllers/signup";

jest.mock("@service/queues/base.queue");
jest.mock("@service/queues/user.queue");
jest.mock("@service/queues/auth.queue");
jest.mock("@service/redis/user.cache");
jest.mock("@global/helpers/cloudinary-upload");

describe("SignUp", () => {
  it("should throw an error if username is not available", () => {
    const req: Request = authMockRequest(
      {},
      {
        username: "",
        email: "test@test.com",
        password: "123456",
        avatarColor: "color",
        avatarImage: "data:text/plain;base64,SVGsbG8sIFdvcmxkIQ==",
      }
    ) as Request;
    const res: Response = authMockResponse();
    Signup.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual(
        "Username is a required field"
      );
    });
  });
});
