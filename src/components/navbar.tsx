"use client"

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

function AuthButton() {
    const { data: session } = useSession();
    if (session?.user) {
        return (
            <>
                Signed in as 
                <div className="ml-1 mr-3 font-bold">
                    {session?.user?.name} 
                </div>
                <Button variant={"link"} className="bg-[#300D4F] text-muted" onClick={() => signOut()}>
                    Sign Out
                </Button>
            </>
        )
    } else {
        return (
            <>
                <Button variant={"link"} className="bg-[#300D4F] text-muted" onClick={() => signIn()}>
                    Sign In
                </Button>
            </>
        )
    }
}

export default function Navbar() {
    return(
        <div className="flex items-center justify-between p-4">
            <Link href={`/`} className="flex items-center">
                <Button variant={"default"}>
                    Home
                </Button>
            </Link>
            <div className="flex items-center">
                <AuthButton />
            </div>
        </div>
    )
}