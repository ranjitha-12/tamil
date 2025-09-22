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
      name?: string;
      email?: string;
      image?: string | null;
      paymentStatus?: string;
    };
  }
  interface User {
    id: string;
    role: string;
    name?: string;
    email?: string;
    image?: string;
    paymentStatus?: string;
  }
  interface JWT {
    id?: string;
    role?: string;
    name?: string;
    email?: string;
    image?: string;
    paymentStatus?: string;
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
          const paymentStatus = user?.student?.paymentStatus;
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
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
   session: {
    strategy: "jwt",
    updateAge: 0, 
    maxAge: 30 * 24 * 60 * 60, 
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
  // On first sign in
  if (user) {
    token.id = user.id;
    token.role = user.role;
    token.name = user.name;
    token.email = user.email;
    token.image = user.image;
    token.paymentStatus = user.paymentStatus;
  }

  // After update trigger — refresh from DB
  if (trigger === "update") {
    await connectMongoDB();
    let dbUser;

    if (token.role === "Parent") {
      dbUser = await Parent.findById(token.id);
    } else if (token.role === "Teacher") {
      dbUser = await Teacher.findById(token.id);
    } else {
      dbUser = await Admin.findById(token.id);
    }

    if (dbUser) {
      token.name = dbUser.name || dbUser.username;
      token.image = dbUser.profileImage || null;
      token.paymentStatus = dbUser.paymentStatus || token.paymentStatus;
    }
  }

  return token;
},
    async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.role = token.role as string;
    session.user.name = token.name as string;
    session.user.email = token.email as string;
    session.user.image = typeof token.image === "string" ? token.image : null;
    session.user.paymentStatus = token.paymentStatus as string;
  }
  return session;
},
  },
};