import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { email, password, phoneNumber } = await request.json();

        if (!email || !password || !phoneNumber) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        await connectToDatabase();

        // Run queries in parallel
        const [existingUser, salt] = await Promise.all([
            User.findOne({ $or: [{ email }, { phoneNumber }] }),
            bcrypt.genSalt(10)
        ]);

        if (existingUser) {
            return NextResponse.json({ message: "Email or phone number already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ email, password: hashedPassword, phoneNumber });

        return NextResponse.json({ message: "User created successfully", user }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: `Error occurred: ${error}` }, { status: 500 });
    }
}
