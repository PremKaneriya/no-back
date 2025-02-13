"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            phoneNumber,
            redirect: false
        });

        if (res?.error) {
            setError("Invalid email or password");
            return;
        }

        router.push("/dashboard");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="w-full p-2 border rounded"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full p-2 border rounded"
                    />
                    <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        className="w-full p-2 border rounded"
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm text-center mt-4">
                    Dont have an account? <a href="/register" className="text-blue-500">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
