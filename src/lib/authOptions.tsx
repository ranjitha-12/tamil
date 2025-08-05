import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Admin from "@/models/adminModel";
import Teacher from "@/models/teacherModel";
import Parent from "@/models/parent";
import { connectMongoDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface JWT {
    id?: string;
    role?: string;
    name?: string;
    email?: string;
    image?: string;
  }
}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        await connectMongoDB();

        let user = await Admin.findOne({ email });
        let role = "Admin";
        let name = user?.name;
        let profileImage = user?.profileImage;

        if (!user) {
          user = await Teacher.findOne({ email });
          role = "Teacher";
          name = user?.name;
          profileImage = user?.profileImage;
        }

        if (!user) {
          user = await Parent.findOne({ email });
          role = "Parent";
          name = user?.username;
          profileImage = user?.profileImage;
        }

        if (!user) return null;

        if (role !== "Parent") {
          if (!user.password) return null;
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name,
          role,
          image: profileImage || null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
        session.user.image = typeof token.image === "string" ? token.image : null;
      }
      return session;
    },
  },
};
