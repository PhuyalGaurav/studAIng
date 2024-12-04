import { NextAuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '@/lib/db';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" }
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials) {
          return null;
        }
      
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
      
          if (!user || !user.email) { 
            return null;
          }
      
          const isValid = user.hashedPassword ? await bcrypt.compare(credentials.password, user.hashedPassword) : false;
      
          if (!isValid) {
            return null;
          }
      
          return {
            id: user.id,
            name: user.name || 'Anonymous',
            email: user.email,
          } as User;
        } catch (error) {
          console.error(error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.sub as string;
      return session;
    },
  },
  events: {
    signIn: async (message) => {
      console.log('User signed in:', message);
    },
    signOut: async (message) => {
      console.log('User signed out:', message);
    },
  },
};