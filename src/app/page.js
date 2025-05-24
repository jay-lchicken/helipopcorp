"use client"
import { useEffect, useState } from "react";
import Head from "next/head";
import Script from "next/script";

export default function Home() {
  return (
    <div className=" min-h-screen w-full flex flex-col items-center justify-center">
      <h1 className={"text-4xl text-center py-4"}>Welcome to the KLC Code IDE</h1>
      <p className="text-2xl text-center">Sign In Now To Get Started</p>
      <input placeholder={"Enter your email"} type={"email"} className="border-2 border-gray-300 text-black rounded-md p-2 mt-4 w-[400px]" />
      <input placeholder={"Enter your password"} type={"password"} className="border-2 border-gray-300 text-black rounded-md p-2 mt-4 w-[400px]" />

    </div>
  );
}