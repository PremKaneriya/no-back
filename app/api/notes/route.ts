import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/database";
import Note from "@/models/Notes";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// Get all notes for the logged-in user
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        await connectToDatabase();
        const notes = await Note.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();

        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json(`Failed to fetch notes: ${error}`, { status: 500 });
    }
}

// Create a new note
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        await connectToDatabase();
        const { title, content } = await request.json();

        if (!title || !content) {
            return NextResponse.json("All fields are required", { status: 400 });
        }
        
        const note = await Note.create({ userId: session.user.id, title, content });
        
        return NextResponse.json(note);
    } catch (error) {
        return NextResponse.json(`Failed to create note: ${error}`, { status: 500 });
    }
}
