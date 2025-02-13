import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" },
                phoneNumber: { label: "Phone Number", type: "tel", placeholder: "phone number" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password || !credentials?.phoneNumber) {
                    throw new Error("Missing credentials");
                }

                try {
                    await connectToDatabase();

                    // Fetch user by phone number
                    const user = await User.findOne({ phoneNumber: credentials.phoneNumber });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    // Compare password
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                    };
                } catch (error) {
                    throw new Error("Authentication failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET
};
