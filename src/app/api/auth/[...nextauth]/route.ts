// import NextAuth from "next-auth";
// import EmailProvider from "next-auth/providers/email";
// import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// import clientPromise from "@/lib/mongodb";
import { sendMagicLink } from "@/lib/sendMagicLink"; // Updated function

// const allowedAdmins = [
//   "deevviill2341@gmail.com",
//   "dev02@sfjbs.com",
//   "rahulyh63@gmail.com",
//   "arun.sfjbs@gmail.com",
//   "rahulyh600@gmail.com",
//   "bskilling.digital@gmail.com",
// ];

// const handler = NextAuth({
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     EmailProvider({
//       async sendVerificationRequest({ identifier: email, url }) {
//         if (!allowedAdmins.includes(email)) {
//           throw new Error("Unauthorized email. Contact support.");
//         }
//         await sendMagicLink(email, url); // ✅ Uses Nodemailer now
//       },
//       from: process.env.EMAIL_USER ?? "arun.sfjbs@gmail.com",
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin",
//   },
//   callbacks: {
//     async signIn({ user }) {
//       if (!allowedAdmins.includes(user.email!)) {
//         return false;
//       }
//       return true;
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token as unknown as string;
//         return session;
//       }
//       return session;
//     },
//   },
//   secret:
//     process.env.NEXTAUTH_SECRET ??
//     "yJmp4LXT8eMme1+x090t2gS8gmrOI9OhyGd0GWIzCy0=",
// });

// export { handler as GET, handler as POST };

// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";
import mongoose from "mongoose";
import { AdminRole } from "@/models/AdminUser";
import EmailProvider from "next-auth/providers/email";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: AdminRole;
  }

  interface Session {
    user: User;
  }
}

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        // if (!allowedAdmins.includes(email)) {
        //   throw new Error("Unauthorized email. Contact support.");
        // }
        await mongoose.connect(
          process.env.DATABASE_URL ??
            "mongodb+srv://itadmin02:XLw7BKzwUok4jF44@devclus.63bz1.mongodb.net/?retryWrites=true&w=majority&appName=devclus"
        );
        const admin = await AdminUser.findOne({
          email: email,
          isActive: true,
        });
        console.log(admin);

        if (!admin) {
          throw new Error("No active admin found with this email");
        }
        await sendMagicLink(email, url); // ✅ Uses Nodemailer now
      },
      from: process.env.EMAIL_USER ?? "arun.sfjbs@gmail.com",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // ✅ On first login, user object is available
        token.id = user.id;
        token.role = user.role;
      } else if (!token.role && token.email) {
        // ✅ On subsequent requests, get role from DB if missing
        const existingUser = await AdminUser.findOne({ email: token.email });
        if (existingUser) {
          token.id = existingUser._id.toString();
          token.role = existingUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AdminRole;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret:
    process.env.NEXTAUTH_SECRET ??
    "yJmp4LXT8eMme1+x090t2gS8gmrOI9OhyGd0GWIzCy0=",
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});

export { handler as GET, handler as POST };
