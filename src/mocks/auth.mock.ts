import { Response, Request } from "express";
import {
  AuthPayload,
  IAuthDocument,
} from "../features/auth/interfaces/auth.interface";

export interface IJWT {
  jwt?: string;
}

export interface IAuthMock {
  _id?: string;
  username?: string;
  email?: string;
  avatarColor?: string;
  avatarImage?: string;
  password?: string;
  confirmPassword?: string;
  uId?: string;
  createdAt?: Date | string;
}

export const authMockRequest = (
  sessionData: IJWT,
  body: IAuthMock,
  currentUser?: AuthPayload | null,
  params?: any
) => ({
  session: sessionData,
  body,
  params,
  currentUser,
});

export const authMockResponse = (): Response => {
  const res: Response = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

export const authUserPayload: AuthPayload = {
  userId: "60263f14648fed5246e322d9",
  uId: "1621613119252066",
  username: "Test",
  email: "test@test.com",
  avatarColor: "#9c27b0",
  iat: 12345,
};

export const authMock = {
  _id: "60263f14648fed5246e322d3",
  uId: "1621613119252066",
  username: "Test",
  email: "test@test.com",
  avatarColor: "#9c27b0",
  createdAt: new Date(),
  save: () => {},
} as unknown as IAuthDocument;

export const signUpMockData = {
  _id: "605727cd646eb50e668a4e13",
  uId: "92241616324557172",
  username: "Test",
  email: "test@test.com",
  avatarColor: "#ff9800",
  password: "123456",
  birthDay: { month: "", day: "" },
  postCount: 0,
  gender: "",
  quotes: "",
  about: "",
  relationship: "",
  blocked: [],
  blockedBy: [],
  bgImageVersion: "",
  bgImageId: "",
  work: [],
  school: [],
  placesLived: [],
  createdAt: new Date(),
  followersCount: 0,
  followingCount: 0,
  notifications: {
    messages: true,
    reactions: true,
    comments: true,
    follows: true,
  },
  profilePicture:
    "https://res.cloudinary.com/ratingapp/image/upload/605727cd646eb50e668a4e13",
};
