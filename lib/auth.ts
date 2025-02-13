import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

export const authOptions = {
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

                    const user = await User.findOne({ phoneNumber: credentials.phoneNumber });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                    };
                }   catch (_error) {
                        console.log("Auth Error", _error);
                        throw new Error("Authentication failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: unknown }) {
            if (user) {
                token.user = { id: (user as { id: string }).id, ...user };
              }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token.user) {
                session.user = token.user as { id: string; }; // Cast token.user to the correct type
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt" as const,  // ✅ Fix the type issue
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET
};
