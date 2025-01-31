import "next-auth";
import { JWT } from "next-auth/jwt";

// NextAuth 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
  }
}

// JWT 타입 확장
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
  }
}
