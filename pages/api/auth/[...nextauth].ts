import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/hash";
import prisma from "../../../lib/prisma";

export const authOptions: NextAuthOptions = {
  //Configure JWT
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          //Find user with the email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });
          // If user exist
          if (user) {
            const checkPassword = await verifyPassword(credentials?.password, user.password);
            // If entered password matches with password in database
            if (checkPassword) {
              if (user.verified === true) return user;
              throw new Error("User Not Verified.");
            }
            // Error invalid password
            throw new Error("Invalid Credentials.");
          }
          //not found send error
          throw new Error("Invalid Credentials.");
        } catch (err: any) {
          throw err;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      console.log(user);
      if (user) {
        token.email = user.email;
        token.id = Number(user.id);
        token.role = user.role;
        token.name = user.firstName + " " + user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      // session.accessToken = token.accessToken;
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
