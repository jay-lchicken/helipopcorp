import {auth} from "@clerk/nextjs/server";
import {cookies} from "next/headers";
import DashboardPage from "@/app/dashboard/Dashboard";

export default async function Main() {
    var results;

    try {
        const cookieStore = await cookies();

        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/GetAssignments`, {
            headers: {
                Cookie: cookieStore?.getAll?.().map(c => `${c.name}=${c.value}`).join('; ') || ''
            },
            credentials: 'include'
        });
        console.log(res)
        if (res.ok) {
             results = await res.json();
        }
    } catch (err) {
        console.error("Failed to fetch user from DB", err);
    }

    return (
        <DashboardPage serverAssignments={results}></DashboardPage>

    );
}