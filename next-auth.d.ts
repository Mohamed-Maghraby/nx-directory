/**
 * Define types for next auth, i,e when trying to authorize the current session or user, next-auth knows what types of props in the session
 */

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id?: string;
  }
}
