import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // ✅ Ensure `id` exists in `user`
  }

  interface Session {
    user: User; // ✅ Extend session to include `id`
  }
}
