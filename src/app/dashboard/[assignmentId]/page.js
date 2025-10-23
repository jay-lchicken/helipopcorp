import {auth} from "@clerk/nextjs/server";
import Assignment from "./assignment";
import {cookies} from "next/headers";

export default async function Main() {
    var user;

    try {
        const cookieStore = await cookies();

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/usersync`, {
            headers: {

                Cookie: cookieStore?.getAll?.().map(c => `${c.name}=${c.value}`).join('; ') || ''
            },
            credentials: 'include'
        });
        if (res.ok) {
            user = await res.json();
        }
    } catch (err) {
        console.error("Failed to fetch user from DB", err);
    }

    return (
            <Assignment DBUser={user}/>

    );
}