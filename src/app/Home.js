"use client"
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect as useEffectRouter } from "react";

export default function Home({DBUser}) {
  const [dbUser, setDbUser] = useState(DBUser);
  const [isLoaded, setIsLoaded] = useState(false);

  const router = useRouter();

  useEffectRouter(() => {
    if (isLoaded && dbUser?.role === "teacher") {
      router.push("/dashboard");
    }
  }, [dbUser, router, isLoaded]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={" w-full items-center justify-center flex flex-col min-h-screen py-8 px-4"}>
        <div className={`flex flex-col items-center space-y-8 mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-110"></div>
            <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <img
                className="w-[280px] h-auto drop-shadow-2xl transform transition-all duration-500 group-hover:scale-105"
                src="/klc.png"
                alt="KLC Logo"
              />
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold  bg-clip-text text-white leading-tight">
              Welcome to KLC Code IDE
            </h1>
            <p className="text-slate-300 text-xl max-w-2xl leading-relaxed">
              Your ultimate coding environment for learning and development
            </p>

          </div>
        </div>

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
            <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-slate-500/5"></div>
              <div className="relative z-10">
                {dbUser && (
                  <div className="text-center mb-8 p-6 bg-slate-700/30 rounded-xl border border-slate-600/30 backdrop-blur-sm">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                      <p className="text-slate-300 text-lg">Welcome back!</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-lg">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 font-semibold rounded-lg border border-blue-500/30">
                        {dbUser?.role}
                      </span>
                      <span className="text-slate-400 hidden sm:block">•</span>
                      <span className="text-slate-300">{dbUser.email}</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  {dbUser?.role === "teacher" && (
                    <button
                      className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold relative overflow-hidden"
                      onClick={() => window.location.href = "/dashboard"}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center justify-center gap-2 whitespace-nowrap">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Go to dashboard
                      </span>
                    </button>
                  )}
                  {dbUser?.role === "student" && (
                    <button
                      className="group w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold relative overflow-hidden"
                      onClick={() => window.location.href = "/ide"}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center justify-center gap-2 whitespace-nowrap">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Go to IDE
                      </span>
                    </button>
                  )}

                  <SignOutButton
                    className="group w-full sm:w-auto px-10 py-4 bg-slate-700/50 text-white rounded-xl shadow-lg hover:bg-slate-600/50 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 font-semibold border border-slate-600/50 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="relative flex items-center justify-center gap-2 whitespace-nowrap h-full">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </span>
                    </div>

                  </SignOutButton>

                </div>

              </div>
            </div>
          </SignedIn>
        </div>


    </div>
  );
}