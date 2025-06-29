"use client"
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/usersync');
        if (res.ok) {
          const user = await res.json();
          setDbUser(user);
        }
      } catch (err) {
        console.error("Failed to fetch user from DB", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className={"flex flex-col items-center justify-center min-h-screen py-2 text-white"}>
      <img className={"w-[300px]"} src={"/klc.png"} />
      <p className={"text-2xl py-4"}>Welcome to the KLC Code IDE</p>

      {loading && <p>Loading user data...</p>}

      <SignedOut>
        <div className={"flex flex-row items-center justify-center gap-4"}>
          <SignInButton mode={"modal"} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold" />
          <SignUpButton mode={"modal"} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold" />
        </div>
      </SignedOut>

      <SignedIn>
        <div className={"flex flex-col items-center gap-4"}>
          {dbUser && <p>You are logged in as: <strong>{dbUser.role}</strong> ({dbUser.email})</p>}

          <div className={"flex flex-row items-center justify-center gap-4"}>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
              onClick={() => window.location.href = "/dashboard"}
            >
              Go to dashboard
            </button>
            <SignOutButton
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
              redirectUrl="/dashboard"
            />
          </div>
        </div>
      </SignedIn>
    </div>
  );
}