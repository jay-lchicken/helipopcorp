"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { SignedIn, SignedOut, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import "xterm/css/xterm.css";

export default function IDE() {
  const { isSignedIn } = useUser();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const termRef = useRef(null);
  const xtermRef = useRef(null);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isTerminalReady, setIsTerminalReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Monaco editor
  useEffect(() => {
    if (!isSignedIn || isEditorLoaded || !editorRef.current || !isScriptLoaded) return;

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
      if (isTerminalReady) setIsLoading(false);
    });
  }, [isSignedIn, isEditorLoaded, isScriptLoaded, isTerminalReady]);

  // Initialize xterm.js terminal once the container is ready
  useEffect(() => {
    async function setupTerminal() {
      if (typeof window !== "undefined" && termRef.current && !xtermRef.current) {
        const { Terminal } = await import("xterm");
        xtermRef.current = new Terminal({
          cols: 80,
          rows: 15,
          theme: {
            background: "#1e1e1e",
            foreground: "#ffffff",
          },
          disableStdin: true, // output only
          fontFamily: '"Fira Mono", monospace',
          fontSize: 14,
        });
        xtermRef.current.open(termRef.current);
        xtermRef.current.write("Terminal ready\r\n");
        setIsTerminalReady(true);
        if (isEditorLoaded) setIsLoading(false);
      }
    }
    setupTerminal();
  }, [termRef, isEditorLoaded]);

  // Send code to Judge0 API
  async function submitToJudge0(code) {
    const res = await fetch("/api/SubmitAssignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source_code: code, language_id: 63 }),
    });

    const data = await res.json();
    console.log("API response:", data);
    return data;
  }

  // Helper to write to terminal, normalizing line endings
  const writeToTerminal = (text) => {
    console.log("Writing to terminal:", text);
    xtermRef.current.write(text.replace(/\n/g, "\r\n"));
  };

  // Handle submit: send code and display output in terminal
  const handleSubmit = async () => {
    if (!isTerminalReady) {
      console.error("Terminal is not ready yet");
      return;
    }
    if (monacoRef.current) {
      const value = monacoRef.current.getValue();
      console.log("Submitted code:", value);

      const res = await submitToJudge0(value);

      xtermRef.current.clear();

      if (res.stdout) {
        writeToTerminal(res.stdout);
      } else if (res.stderr) {
        writeToTerminal(res.stderr);
      } else {
        writeToTerminal("No output returned from Judge0.");
      }
    }
  };

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/loader.js"
        onLoad={() => setIsScriptLoaded(true)}
      />

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
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
              <div className="text-white text-xl font-semibold">Loading IDE...</div>
            </div>
          )}
          <div className="flex flex-col items-center p-8">
            <div className="flex items-center justify-between w-full max-w-[1500px] mb-4">
              <img className="w-[300px]" src="/klc.png" alt="KLC Logo" />
              <button
                disabled={!isTerminalReady}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow ${!isTerminalReady ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleSubmit}
              >
                Submit Code
              </button>
            </div>

            <div
              ref={editorRef}
              style={{
                height: "55vh",
                width: "100%",
                maxWidth: "1500px",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />

            <div
              ref={termRef}
              style={{
                height: "20vh",
                width: "100%",
                maxWidth: "1500px",
                border: "1px solid #333",
                borderRadius: "8px",
                marginTop: "0.5rem",
                backgroundColor: "#1e1e1e",
              }}
            />
          </div>
        </SignedIn>
      </div>
    </>
  );
}
