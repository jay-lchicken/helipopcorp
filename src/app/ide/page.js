"use client"
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function getIDPage({}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [assignmentId, setAssignmentId] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={" w-full items-center justify-center flex flex-col min-h-screen py-8 px-4"}>
        <div className={`w-full max-w-lg mx-auto transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <SignedOut>
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-slate-500/5"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-semibold text-center mb-8 text-slate-200">
                  Get Started
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <SignInButton
                    mode="modal"
                    className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold text-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="relative flex items-center justify-center gap-2 whitespace-nowrap">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In
                    </span>
                    </div>

                  </SignInButton>

                  <SignUpButton
                    mode="modal"
                    className="group w-full sm:w-auto px-10 py-4 bg-slate-700/50 text-white rounded-xl shadow-lg hover:bg-slate-600/50 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold text-center border border-slate-600/50 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="relative flex items-center justify-center gap-2 whitespace-nowrap">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Sign Up
                    </span>
                    </div>

                  </SignUpButton>
                </div>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-slate-500/5"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-semibold text-center mb-8 text-slate-200">
                  Enter Assignment ID
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Assignment ID submitted:", assignmentId);
                  }}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    placeholder="Assignment ID"
                    className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={assignmentId}
                    onChange={(e) => setAssignmentId(e.target.value)}
                    required
                  />
                  <button
                    onClick={() => {
                      window.location.href = `/ide/${assignmentId}`;
                    }}
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </SignedIn>
        </div>
    </div>
  );
}