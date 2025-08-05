import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// visit next-auth (maybe AuthJs in fature) documentation to understand the code in this page
// this page is use next-auth for login
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { lable: "Email", type: "text" },
        password: { lable: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        try {
          await connectToDb();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with this credentials");
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("invalid Password");
          }
          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          console.error("Next-auth error while login: ", error);
          throw error;
        }
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    // collbacks help us to access user id from noth token and sessions in both frontend and backend
    async jwt({ token, user }) {
      // set user id in token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // set user id into session
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    //sessions methods and time limit of the session
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
