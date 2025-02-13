"use client"
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

function Header() { 
    const { data: session } = useSession();

    const handleSignout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
        <div className="bg-gray-800">
            <button onClick={handleSignout}>Sign out</button>


            {session ? (
                <div>
                    Welcome
                </div>
            ): (
                <div>
                    Not signed in
                    <Link href='/login' >login</Link>
                    <Link href='/register'>register</Link>
                </div>
            )}

        </div>
        </>
    )

}

export default Header