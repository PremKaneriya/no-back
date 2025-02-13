"use client";
import { FaLightbulb, FaBell, FaPen, FaDownload, FaTrash, FaThumbtack } from "react-icons/fa";
import { useEffect, useState } from "react";

type Note = {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    pinned?: boolean;
};

const Dashboard = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    // Fetch notes when component loads
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await fetch("/api/notes");
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data);
                }
                setNotes(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNotes();
    }, []);

    // Handle form submission (Create Note)
    const handleCreateNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) {
            setError("Title and Content are required!");
            return;
        }
        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });
            if (!res.ok) {
                throw new Error(await res.text());
            }
            const newNote = await res.json();
            setNotes([newNote, ...notes]); // Add new note to UI
            setTitle("");
            setContent("");
            setError("");
        } catch (error) {
            console.error(error);
            setError("Failed to create note");
        }
    };

    // Handle pin note
    const handlePinNote = (id: string) => {
        setNotes((prev) =>
            prev.map((note) => (note._id === id ? { ...note, pinned: !note.pinned } : note))
        );
    };

    // Handle delete note
    const handleDeleteNote = (id: string) => {
        setNotes((prev) => prev.filter((note) => note._id !== id));
    };

    // Random color generator for notes
    const getRandomColor = () => {
        const colors = ["#f28b82", "#fbbc04", "#fff475", "#ccff90", "#a7ffeb", "#cbf0f8", "#aecbfa", "#d7aefb"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
<div className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white">
    {/* Sidebar for Desktop | Bottom Nav for Mobile */}
    <aside className="hidden md:flex w-16 bg-gray-800 flex-col items-center py-5 space-y-8">
        <FaLightbulb size={24} className="text-yellow-400 cursor-pointer" />
        <FaBell size={20} className="cursor-pointer" />
        <FaPen size={20} className="cursor-pointer" />
        <FaDownload size={20} className="cursor-pointer" />
        <FaTrash size={20} className="cursor-pointer" />
    </aside>

    {/* Mobile Bottom Nav */}
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-gray-800 flex justify-around py-3 border-t border-gray-700">
        <FaLightbulb size={24} className="text-yellow-400 cursor-pointer" />
        <FaBell size={20} className="cursor-pointer" />
        <FaPen size={20} className="cursor-pointer" />
        <FaDownload size={20} className="cursor-pointer" />
        <FaTrash size={20} className="cursor-pointer" />
    </div>

    {/* Main Content */}
    <main className="flex-1 p-6 pb-20 md:pb-6 w-full max-w-5xl mx-auto">
        {/* Create Note Section */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">Create a Note</h2>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <form onSubmit={handleCreateNote} className="space-y-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition duration-300"
                >
                    Add Note
                </button>
            </form>
        </div>

        {/* Notes Grid */}
        <h2 className="text-2xl font-semibold text-center mt-8">Your Notes</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.length > 0 ? (
                notes
                    .sort((a, b) => Number(b.pinned) - Number(a.pinned))
                    .map((note) => (
                        <div
                            key={note._id}
                            style={{ backgroundColor: getRandomColor() }}
                            className="relative p-6 rounded-2xl shadow-md text-black w-full"
                        >
                            {/* Pin & Delete Buttons */}
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button
                                    onClick={() => handlePinNote(note._id)}
                                    className={`p-2 rounded-full ${note.pinned ? "bg-yellow-400" : "bg-gray-300"}`}
                                >
                                    <FaThumbtack />
                                </button>
                                <button
                                    onClick={() => handleDeleteNote(note._id)}
                                    className="p-2 rounded-full bg-red-400"
                                >
                                    <FaTrash />
                                </button>
                            </div>

                            {/* Note Content */}
                            <h3 className="text-lg font-semibold">{note.title}</h3>
                            <p className="mt-2">{note.content}</p>
                            <p className="text-xs text-gray-600 mt-4">
                                Created: {new Date(note.createdAt).toLocaleString()}
                            </p>
                        </div>
                    ))
            ) : (
                <p className="text-center col-span-full text-gray-400">No notes found.</p>
            )}
        </div>
    </main>
</div>

    );
};

export default Dashboard;
