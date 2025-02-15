import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { email, password, phoneNumber } = await request.json();

        if (!email || !password || !phoneNumber) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email or phone number already exists" },
                { status: 400 }
            );
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            password: hashedPassword, // Save hashed password
            phoneNumber
        });

        return NextResponse.json(
            { message: "User created successfully", user },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: `Error occurred: ${error}` },
            { status: 500 }
        );
    }
}
