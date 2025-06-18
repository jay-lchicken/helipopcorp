"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { SignedIn, SignedOut, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function IDEPage() {
  const { isSignedIn } = useUser();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  useEffect(() => {
    if (!isSignedIn || isEditorLoaded || !editorRef.current) return;

    setTimeout(() => {
      window.require.config({
        paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor/min/vs" },
      });

      window.require(["vs/editor/editor.main"], () => {
        monacoRef.current = window.monaco.editor.create(editorRef.current, {
          value: "// Welcome to KLC IDE\n",
          language: "javascript",
          theme: "vs-dark",
          automaticLayout: true,
        });
        setIsEditorLoaded(true);
      });
    }, 300);
  }, [isSignedIn, isEditorLoaded]);

  const handleSubmit = () => {
    if (monacoRef.current) {
      const value = monacoRef.current.getValue();
      console.log("Submitted code:", value);
    }
  };

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/loader.js" strategy="beforeInteractive" />

      <div className="min-h-screen bg-[#01639A] text-white">
        <SignedOut>
          {/* Centered full-page layout for signed-out users */}
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
          <div className="flex flex-col items-center p-8">
            <div className="flex items-center justify-between w-full max-w-[1500px] mb-4">
              <img className="w-[300px]" src="/klc.png" alt="KLC Logo" />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
                onClick={handleSubmit}
              >
                Submit Code
              </button>
            </div>

            <div
              ref={editorRef}
              style={{
                height: "80vh",
                width: "100%",
                maxWidth: "1500px",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />
          </div>
        </SignedIn>
      </div>
    </>
  );
}
