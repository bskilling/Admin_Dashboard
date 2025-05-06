import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { sendMagicLink } from "@/lib/sendMagicLink"; // Updated function

const allowedAdmins = [
  "deevviill2341@gmail.com",
  "dev02@sfjbs.com",
  "rahulyh63@gmail.com",
  "arun.sfjbs@gmail.com",
  "rahulyh600@gmail.com",
  "bskilling.digital@gmail.com",
];

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        if (!allowedAdmins.includes(email)) {
          throw new Error("Unauthorized email. Contact support.");
        }
        await sendMagicLink(email, url); // ✅ Uses Nodemailer now
      },
      from: process.env.EMAIL_USER,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }) {
      if (!allowedAdmins.includes(user.email!)) {
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token as unknown as string;
        return session;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
