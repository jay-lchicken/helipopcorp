"use client"
import { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className={"flex flex-col items-center justify-center min-h-screen py-2 text-white"}>
           <img className={"w-[300px]"} src={"/klc.png"}/>
              <p className={"text-2xl py-4"}>Welcome to the KLC Code IDE</p>
          <SignedOut>
              <div className={"flex flex-row items-center justify-center gap-4"}>
                <SignInButton mode={"modal"} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold" />
                <SignUpButton mode={"modal"} className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold" />
              </div>
          </SignedOut>
          <SignedIn>
            <div className={"flex flex-row items-center justify-center gap-4"}>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold" onClick={() => window.location.href = "/dashboard"}>Go to dashboard</button>
              <SignOutButton className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold" redirectUrl="/dashboard"/>
            </div>
          </SignedIn>
      </div>
  );
}