import NextAuth from "next-auth";

declare module "next-auth" {
  interface JWT {
    role?: string;
  }

  interface User {
    role?: string; 
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}
