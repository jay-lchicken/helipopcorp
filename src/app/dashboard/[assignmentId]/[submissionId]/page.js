"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { SignedIn, SignedOut, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import "xterm/css/xterm.css";
import { getAllJSDocTagsOfKind } from "typescript";

// Judge0 Language mappings
const JUDGE0_LANGUAGES = {
  45: { name: "Assembly (NASM 2.14.02)", monaco: "asm", ext: "asm" },
  46: { name: "Bash (5.0.0)", monaco: "shell", ext: "sh" },
  47: { name: "Basic (FBC 1.07.1)", monaco: "vb", ext: "bas" },
  75: { name: "C (Clang 7.0.1)", monaco: "c", ext: "c" },
  76: { name: "C++ (Clang 7.0.1)", monaco: "cpp", ext: "cpp" },
  48: { name: "C (GCC 7.4.0)", monaco: "c", ext: "c" },
  52: { name: "C++ (GCC 7.4.0)", monaco: "cpp", ext: "cpp" },
  49: { name: "C (GCC 8.3.0)", monaco: "c", ext: "c" },
  53: { name: "C++ (GCC 8.3.0)", monaco: "cpp", ext: "cpp" },
  50: { name: "C (GCC 9.2.0)", monaco: "c", ext: "c" },
  54: { name: "C++ (GCC 9.2.0)", monaco: "cpp", ext: "cpp" },
  86: { name: "Clojure (1.10.1)", monaco: "clojure", ext: "clj" },
  51: { name: "C# (Mono 6.6.0.161)", monaco: "csharp", ext: "cs" },
  77: { name: "COBOL (GnuCOBOL 2.2)", monaco: "cobol", ext: "cob" },
  55: { name: "Common Lisp (SBCL 2.0.0)", monaco: "lisp", ext: "lisp" },
  56: { name: "D (DMD 2.089.1)", monaco: "d", ext: "d" },
  57: { name: "Elixir (1.9.4)", monaco: "elixir", ext: "ex" },
  58: { name: "Erlang (OTP 22.2)", monaco: "erlang", ext: "erl" },
  44: { name: "Executable", monaco: "plaintext", ext: "exe" },
  87: { name: "F# (.NET Core SDK 3.1.202)", monaco: "fsharp", ext: "fs" },
  59: { name: "Fortran (GFortran 9.2.0)", monaco: "fortran", ext: "f90" },
  60: { name: "Go (1.13.5)", monaco: "go", ext: "go" },
  88: { name: "Groovy (3.0.3)", monaco: "groovy", ext: "groovy" },
  61: { name: "Haskell (GHC 8.8.1)", monaco: "haskell", ext: "hs" },
  62: { name: "Java (OpenJDK 13.0.1)", monaco: "java", ext: "java" },
  63: { name: "JavaScript (Node.js 12.14.0)", monaco: "javascript", ext: "js" },
  78: { name: "Kotlin (1.3.70)", monaco: "kotlin", ext: "kt" },
  64: { name: "Lua (5.3.5)", monaco: "lua", ext: "lua" },
  89: { name: "Multi-file program", monaco: "plaintext", ext: "zip" },
  79: { name: "Objective-C (Clang 7.0.1)", monaco: "objective-c", ext: "m" },
  65: { name: "OCaml (4.09.0)", monaco: "ocaml", ext: "ml" },
  66: { name: "Octave (5.1.0)", monaco: "matlab", ext: "m" },
  67: { name: "Pascal (FPC 3.0.4)", monaco: "pascal", ext: "pas" },
  85: { name: "Perl (5.28.1)", monaco: "perl", ext: "pl" },
  68: { name: "PHP (7.4.1)", monaco: "php", ext: "php" },
  43: { name: "Plain Text", monaco: "plaintext", ext: "txt" },
  69: { name: "Prolog (GNU Prolog 1.4.5)", monaco: "prolog", ext: "pl" },
  70: { name: "Python (2.7.17)", monaco: "python", ext: "py" },
  71: { name: "Python (3.8.1)", monaco: "python", ext: "py" },
  80: { name: "R (4.0.0)", monaco: "r", ext: "r" },
  72: { name: "Ruby (2.7.0)", monaco: "ruby", ext: "rb" },
  73: { name: "Rust (1.40.0)", monaco: "rust", ext: "rs" },
  81: { name: "Scala (2.13.2)", monaco: "scala", ext: "scala" },
  82: { name: "SQL (SQLite 3.27.2)", monaco: "sql", ext: "sql" },
  83: { name: "Swift (5.2.3)", monaco: "swift", ext: "swift" },
  74: { name: "TypeScript (3.7.4)", monaco: "typescript", ext: "ts" },
  84: { name: "Visual Basic.Net (vbnc 0.0.0.5943)", monaco: "vb", ext: "vb" }
};

// Monaco Editor Themes
const MONACO_THEMES = [
  { value: "vs-dark", label: "Dark (Default)" },
  { value: "vs", label: "Light" },
  { value: "hc-black", label: "High Contrast Dark" },
  { value: "hc-light", label: "High Contrast Light" }
];

export default function Code_Viewer() {
  const { assignmentId } = useParams();
  const { isSignedIn } = useUser();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const termRef = useRef(null);
  const xtermRef = useRef(null);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isTerminalReady, setIsTerminalReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(63); // Default to JavaScript
  const [selectedTheme, setSelectedTheme] = useState("vs-dark");

  // Initialize Monaco editors
  useEffect(() => {
    if (!isSignedIn || isEditorLoaded || !editorRef.current || !isScriptLoaded) return;

    window.require.config({
      paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor/min/vs" },
    });

    window.require(["vs/editor/editor.main"], () => {
      const currentLanguage = JUDGE0_LANGUAGES[selectedLanguage];
      monacoRef.current = window.monaco.editor.create(editorRef.current, {
        value: "",
        language: currentLanguage?.monaco || "javascript",
        theme: selectedTheme,
        automaticLayout: true,
        fontSize: 14,
        lineHeight: 20,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        smoothScrolling: true,
      });
      setIsEditorLoaded(true);
      if (isTerminalReady) setIsLoading(false);
    });
  }, [isSignedIn, isEditorLoaded, isScriptLoaded, isTerminalReady, selectedLanguage, selectedTheme]);

  const handleLanguageChange = (langId) => {
    setSelectedLanguage(parseInt(langId));
    if (monacoRef.current) {
      const language = JUDGE0_LANGUAGES[langId];
      const model = monacoRef.current.getModel();
      window.monaco.editor.setModelLanguage(model, language?.monaco || "javascript");
      monacoRef.current.setValue(getDefaultCode(parseInt(langId)));
    }
  };


  const getSubmissionFromDatabase = async () => {
    try {
      const res = await fetch(`/api/GetSubmissions?assignmentId=${assignmentId}`,);
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const data = await res.json();
      console.log("Assignments API response:", data);
      const matched = data.find((a) => a.name === assignmentName);
      return matched || null;
    } catch (err) {
      console.error("Error fetching assignments:", err);
      return null;
    }
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    if (monacoRef.current) {
      window.monaco.editor.setTheme(theme);
    }
  };

  useEffect(() => {
    async function setupTerminal() {
      if (typeof window !== "undefined" && termRef.current && !xtermRef.current) {
        const { Terminal } = await import("xterm");
        xtermRef.current = new Terminal({
          cols: 80,
          rows: 15,
          theme: {
            background: "#1a1a1a",
            foreground: "#e0e0e0",
            cursor: "#00ff00",
            cursorAccent: "#00ff00",
            selection: "rgba(255, 255, 255, 0.3)",
          },
          disableStdin: true,
          fontFamily: '"Fira Mono", "Monaco", "Consolas", monospace',
          fontSize: 13,
          lineHeight: 1.2,
          cursorBlink: true,
        });
        xtermRef.current.open(termRef.current);
        xtermRef.current.write("🚀 \x1b[32mTerminal ready\x1b[0m - KLC IDE v1.0\r\n");
        setIsTerminalReady(true);
        if (isEditorLoaded) setIsLoading(false);
      }
    }
    setupTerminal();
  }, [termRef, isEditorLoaded]);

  async function submitToJudge0(code) {
    const res = await fetch("/api/RunCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_code: code, language_id: selectedLanguage }),
    });

    const data = await res.json();
    console.log("API response:", data);
    return data;
  }

  const writeToTerminal = (text) => {
    xtermRef.current.write(text.replace(/\n/g, "\r\n"));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!isTerminalReady) return;
    if (monacoRef.current) {
      const value = monacoRef.current.getValue();

      xtermRef.current.clear();
      xtermRef.current.write("⚡ \x1b[33mExecuting code...\x1b[0m\r\n");
      xtermRef.current.write("─".repeat(50) + "\r\n");

      const res = await submitToJudge0(value);

      if (res.stdout) {
        xtermRef.current.write("\x1b[32m✓ Output:\x1b[0m\r\n");
        writeToTerminal(res.stdout);
      } else if (res.stderr) {
        xtermRef.current.write("\x1b[31m✗ Error:\x1b[0m\r\n");
        writeToTerminal(res.stderr);
      } else {
        xtermRef.current.write("\x1b[90mNo output returned from Judge0.\x1b[0m\r\n");
      }

      xtermRef.current.write("\r\n" + "─".repeat(50) + "\r\n");
      setIsSubmitting(false);
    }
  };

  const handleClearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.write("🚀 \x1b[32mTerminal ready\x1b[0m - KLC IDE v1.0\r\n");
    }
  };

  const SubmitToDatabase = async () => {
    // Debug: Ensure assignmentId is not undefined
    console.log("Submitting to database with assignmentId:", assignmentId);
    const res = await fetch("/api/SubmitCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assignment_id: assignmentId,
        code: monacoRef.current.getValue(),
      }),
    });
  }

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/loader.js"
        onLoad={() => setIsScriptLoaded(true)}
      />

      <div className="min-h-screen text-white">
        <SignedOut>
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="flex flex-col items-center text-center space-y-8 max-w-md">
              <div className="relative">
                <img
                  className="drop-shadow-2xl"
                  src="/klc.png"
                  alt="KLC Logo"
                />
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
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-white text-xl font-semibold">Loading IDE...</div>
                <div className="text-gray-400 text-sm">Setting up your coding environment</div>
              </div>
            </div>
          )}

          <div className="flex flex-col h-screen">
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <img className=" h-12" src="/klc.png" alt="KLC Logo" />
                <div>
                  <h1 className="text-xl font-bold text-white">KLC IDE</h1>
                  <p className="text-xs text-gray-400">{JUDGE0_LANGUAGES[selectedLanguage]?.name || "JavaScript Environment"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                >
                  {Object.entries(JUDGE0_LANGUAGES).map(([id, lang]) => (
                    <option key={id} value={id}>
                      {lang.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedTheme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors duration-200"
                >
                  {MONACO_THEMES.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleClearTerminal}
                  disabled={!isTerminalReady}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Clear Terminal
                </button>

                <button
                  disabled={!isTerminalReady || isSubmitting}
                  className={`px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isSubmitting ? 'animate-pulse' : ''
                  }`}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Running...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>▶</span>
                      <span>Run Code</span>
                    </div>
                  )}
                </button>

                <button
                  className="px-6 py-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={SubmitToDatabase}
                >
                  <div className="flex items-center space-x-2">
                    <span>Submit Code</span>
                  </div>
                </button>
              </div>
            </header>

            <div className="flex-1 flex flex-col p-6 space-y-6">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-200 flex items-center space-x-2">
                    <span>📝</span>
                    <span>Code Editor</span>
                  </h2>
                  <div className="text-sm text-gray-400">
                    Language: {JUDGE0_LANGUAGES[selectedLanguage]?.name || "JavaScript"}
                  </div>
                </div>

                <div
                  ref={editorRef}
                  className="flex-1 rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden"
                  style={{
                    minHeight: "400px",
                    backgroundColor: "#1e1e1e",
                  }}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-200 flex items-center space-x-2">
                    <span>💻</span>
                    <span>Terminal Output</span>
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isTerminalReady ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-400">
                      {isTerminalReady ? 'Ready' : 'Initializing...'}
                    </span>
                  </div>
                </div>

                <div
                  ref={termRef}
                  className="h-64 rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden"
                  style={{
                    backgroundColor: "#1a1a1a",
                  }}
                />
              </div>
            </div>
          </div>
        </SignedIn>
      </div>
    </>
  );
}