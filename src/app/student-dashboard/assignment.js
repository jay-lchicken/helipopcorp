"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  useUser,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";



export default function CompletedAssignments({submissions}) {
  const { isSignedIn } = useUser();

  const [loading, setLoading] = useState(false);






  return (
    <div className="min-h-screen text-white">
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="flex flex-col items-center text-center space-y-8 max-w-md">
            <div className="relative">
              <img className="drop-shadow-2xl" src="/klc.png" alt="KLC Logo" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-70"></div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                KLC Code IDE
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                Your modern coding environment with real-time execution
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <SignInButton mode="modal">
                <button className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300 transform hover:scale-105">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-xl shadow-lg hover:shadow-xl font-semibold transition-all duration-300 transform hover:scale-105">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-white text-xl font-semibold">Loading page...</div>
            </div>
          </div>
        )}

        <div className="flex flex-col h-screen">
          <header className="flex items-center justify-between px-6 py-3 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
            <div className="flex items-center">
              <img className="h-12" src="/klc.png" alt="KLC Logo" />
            </div>
            <div className="flex-1 text-center">
                                <p>Past Submissions</p>

            </div>
            <div className="w-12" />
          </header>
          <main className="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-4">Submissions</h2>
              {submissions.length !== 0 ? (
                <ul className="space-y-4">
      {submissions.map((sub, index) => (
        <li
          key={index}
          className="p-5 bg-slate-800/40 backdrop-filter backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => {
            // Navigate to assignmentName/submissionId
            window.location.href = `./${assignmentID}/${sub.id}`;
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span >
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 text-xs font-semibold mr-2">
              User: {sub.user_id}
            </span>
            {sub.score !== null ? (<span className="px-2 py-1 bg-green-500/20 text-green-700 rounded-lg border border-green-500/30 text-xs font-semibold">
  Graded
</span>): (<span className="px-2 py-1 bg-yellow-400/20 text-yellow-700 rounded-lg border border-yellow-400/30 text-xs font-semibold">
  To be graded
</span>)
              }
            </span>


            <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/40 text-xs font-mono">
              {new Date(sub.created_at).toLocaleString()}
            </span>
          </div>
          <div className="bg-gray-900 rounded-lg p-3 border border-gray-700/60 text-sm font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap">
            {sub.code && sub.code.length > 100
              ? sub.code.slice(0, 100) + "..."
              : sub.code}
          </div>
        </li>
      ))}
    </ul>
              ) : (
                <p className="text-gray-400">No assignments completed</p>
              )}
            </div>
            <div className="w-full h-[60vh]">
              <div id="monaco-editor-container" className="w-full h-full" />
            </div>
          </main>
        </div>
      </SignedIn>
    </div>
  );
}