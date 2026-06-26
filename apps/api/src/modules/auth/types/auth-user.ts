import { Request } from "express";

export type AuthUser = {
  id: string;
  email: string;
};

export type AuthenticatedRequest = Request & {
  user: AuthUser;
};

export type AccessTokenPayload = {
  sub: string;
  email: string;
};
