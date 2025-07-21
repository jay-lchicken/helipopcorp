"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function SubmittedPage() {
  return (
    <div className="min-h-screen bg-[#00639A] text-white">
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center text-center">
            <img className="w-[300px]" src="/klc.png" alt="KLC Logo" />
            <p className="text-2xl py-4">Welcome to the KLC Code IDE</p>
            <div className="flex gap-4">
              <SignInButton
                mode="modal"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold"
              />
              <SignUpButton
                mode="modal"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold"
              />
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center text-center">
            <img className="w-[300px]" src="/klc.png" alt="KLC Logo" />
            <p className="text-2xl py-4">✅ Code Submitted!</p>
            <p className="mb-4">Your code has been successfully submitted :)</p>
            <a
              href="/"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold"
            >
              Go to Home Page
            </a>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
