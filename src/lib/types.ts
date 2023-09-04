import { z } from "zod";

import { signinSchema } from "@/lib/schema";

export type SignInData = z.infer<typeof signinSchema>;

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      rwToken: string;
      id: string;
      email: string;
      role: string;
      createdAt: Date;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    rwToken: string;
    id: string;
    email: string;
    role: string;
    createdAt: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    rwToken: string;
    id: string;
    email: string;
    role: string;
    createdAt: Date;
  }
}
