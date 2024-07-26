import NextAuth, { Account, NextAuthOptions, Profile } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { verifyPassword } from "../../../lib/password";
import prisma from "../../../lib/prisma";

export const validatePassword = (password: string) => {
  const passwordRegex = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*[!@#$%^&*])(?!.*\s).{8,16}$/
  );
  if (passwordRegex.test(password)) return true;
  return false;
};
export const validateEmail = (email: string) => {
  const emailRegex = new RegExp(
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  );
  if (emailRegex.test(email.toLowerCase())) return true;
  return false;
};

export const authOptions: NextAuthOptions = {
  //Configure JWT
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 4,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          //Find user with the email
          const user = await prisma!.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });
          // If user exist
          if (user) {
            // If entered password matches with password in database
            if (
              verifyPassword(credentials?.password, user.password, user.salt)
            ) {
              if (!user.verifiedEmail)
                throw new Error("User has not verified their email.");
              return user;
            }
            // Error invalid password
            throw new Error("Invalid Credentials.");
          }
          //not found send error
          throw new Error("User does not exist.");
        } catch (err: any) {
          throw err;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const _user = await prisma?.user.findUnique({
            where: {
              socialId_socialProvider: {
                socialId: account.providerAccountId,
                socialProvider: account.provider,
              },
            },
          });
          if (_user) {
            token.id = _user.id;
            token.role = _user.role;
          } else throw new Error("User does not exist.");
        } else {
          console.log({ token });
          token.id = Number(user.id);
          token.role = user.role;
          token.name = user.firstName + " " + user.lastName;
          console.log({ token });
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
    async signIn({
      user,
      account,
      profile,
    }: {
      user: any;
      account: Account | null;
      profile?: any;
    }) {
      if (account?.provider === "google") {
        const _user = await prisma?.user.findUnique({
          where: {
            socialId_socialProvider: {
              socialId: account.providerAccountId,
              socialProvider: account.provider,
            },
          },
        });
        if (!_user) {
          await prisma?.user.create({
            data: {
              email: profile.email,
              firstName: profile.given_name,
              lastName: profile.family_name,
              socialId: profile.sub,
              socialProvider: account.provider,
              verifiedEmail: true,
            },
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);
