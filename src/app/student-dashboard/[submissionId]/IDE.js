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

export default function IDE2({data}) {
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
  const [showGradingForm, setShowGradingForm] = useState(false);
const [grade, setGrade] = useState('');
const [feedback, setFeedback] = useState('');
const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

  useEffect(() => {
  if (data && editorRef.current && monacoRef.current && isEditorLoaded) {
    const codeToUse = data.code || getDefaultCode(data.language_id);
    setSelectedLanguage(Number(data.language_id));

    const languageObj = JUDGE0_LANGUAGES[data.language_id];
    const monacoLanguage = languageObj?.monaco || "javascript";

    // Update editor model
    const model = monacoRef.current.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, monacoLanguage);
      monacoRef.current.setValue(codeToUse);
    }
  }
}, [data, isEditorLoaded]);

  // Get default code for language
  const getDefaultCode = (langId) => {
    const language = JUDGE0_LANGUAGES[langId];
    if (!language) return "// Welcome to KLC IDE\n// Start coding here...\n";

    const examples = {
      63: "// Welcome to KLC IDE\n// JavaScript Example\nconsole.log('Hello, World!');\n",
      71: "# Welcome to KLC IDE\n# Python Example\nprint('Hello, World!')\n",
      62: "// Welcome to KLC IDE\n// Java Example\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}\n",
      54: "// Welcome to KLC IDE\n// C++ Example\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, World!\" << endl;\n    return 0;\n}\n",
      50: "// Welcome to KLC IDE\n// C Example\n#include <stdio.h>\n\nint main() {\n    printf(\"Hello, World!\\n\");\n    return 0;\n}\n",
      70: "# Welcome to KLC IDE\n# Python 2 Example\nprint 'Hello, World!'\n",
      72: "# Welcome to KLC IDE\n# Ruby Example\nputs 'Hello, World!'\n",
      60: "// Welcome to KLC IDE\n// Go Example\npackage main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n}\n",
      73: "// Welcome to KLC IDE\n// Rust Example\nfn main() {\n    println!(\"Hello, World!\");\n}\n",
      74: "// Welcome to KLC IDE\n// TypeScript Example\nconsole.log('Hello, World!');\n"
    };

    return examples[langId] || `// Welcome to KLC IDE\n// ${language.name} Example\n// Start coding here...\n`;
  };

  // Initialize Monaco editor
  useEffect(() => {
    if (!isSignedIn || isEditorLoaded || !editorRef.current || !isScriptLoaded) return;

    window.require.config({
      paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor/min/vs" },
    });

     window.require(["vs/editor/editor.main"], () => {
  const langId = data?.language_id || selectedLanguage;
  const codeToUse = data?.code || getDefaultCode(langId);
  const currentLanguage = JUDGE0_LANGUAGES[langId];

  monacoRef.current = window.monaco.editor.create(editorRef.current, {
    value: codeToUse,
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
  setSelectedLanguage(Number(langId));
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
        language_id: selectedLanguage,
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
                                                   <div className=" rounded-lg shadow-sm border border-gray-200 p-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    {/* Student Info Section */}
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div>
        <p className="text-sm  font-medium text-white">Student Email</p>
        <p className="text-lg font-semibold text-white">{data.user_id}</p>
      </div>
    </div>

    {/* Score Section */}
    <div className="flex items-center">
      {data.score && data.total_score ? (
        <div className="text-right">
          <p className="text-sm text-white font-medium">Score</p>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">
              {data.score}/{data.total_score}
            </span>
            <div className="flex items-center">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(data.score / data.total_score) * 100}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-white">
                {Math.round((data.score / data.total_score) * 100)}%
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-yellow-800 font-medium">Pending Grading</span>
        </div>
      )}
    </div>
  </div>
</div>



                        </header>


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
  onClick={() => setShowGradingForm(true)}
  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-lg transition-colors duration-200 text-sm shadow-lg hover:shadow-xl"
>
  Grade Submission
</button>


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
          {showGradingForm && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md relative">
      <div className="p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Grade Submission
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Student Email
            </label>
            <input
              type="text"
              value={data?.user_id || ''}
              disabled
              className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/50 rounded-xl text-slate-400 transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Score
              </label>
              <input
                type="number"
                placeholder="0"
                min="0"
                max={`${data.total_score}`}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Score
              </label>
              <input
                type="number"
                placeholder="100"
                min="1"
                value={data.total_score}
                disabled
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-400 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Feedback
            </label>
            <textarea
              placeholder="Enter your feedback for the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none"
            />
          </div>

          {grade && data.total_score && (
            <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Grade Percentage:</span>
                <span className={`text-lg font-bold ${
                  (grade / data.total_score) * 100 >= 70 ? 'text-green-400' : 
                  (grade / data.total_score) * 100 >= 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {((grade / data.total_score) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 bg-slate-600 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    (grade / data.total_score) * 100 >= 70 ? 'bg-green-500' : 
                    (grade / data.total_score) * 100 >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((grade / data.total_score) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => {
              setShowGradingForm(false);
              setGrade('');
              setFeedback('');
            }}
            className="px-6 py-3 bg-slate-600/50 hover:bg-slate-600/70 text-white rounded-xl font-semibold transition-all duration-300 border border-slate-500/50"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              if (!grade.trim()) {
                alert("Grade is required");
                return;
              }

              if (parseFloat(grade) > parseFloat(data.total_score)) {
                alert("Grade cannot exceed maximum score");
                return;
              }
              if (!feedback.trim()) {
                alert("Feedback is required");
                return;
              }

              setIsSubmittingGrade(true);

              // Here you would call your grading API
             const res = await fetch("/api/GradeCode", {
                                            method: "POST",
                                            headers: {"Content-Type": "application/json"},
                                            body: JSON.stringify({
                                                score: grade,
                                              feedback: feedback,
                                                submission_id: data.submission_id,
                                              student_email: data.user_id,
                                                assignment_id: assignmentId,
                                              total_score: data.total_score,
                                            }),
                                        });

                                        const resu = await res.json();
                                        if (resu.error){
                                            alert(`Error: ${resu.error}`);
                                            setIsSubmittingGrade(false);
                                            setShowGradingForm(false);
              setGrade('');
              setFeedback('');
              setIsSubmittingGrade(false);
                                            return;
                                        }else{
                                                        alert(`Grade submitted successfully!\nScore: ${grade}/${data.total_score} (${((grade/data.total_score)*100).toFixed(1)}%)`);
                                                        window.location.reload();
                                                        setShowGradingForm(false);
              setGrade('');
              setFeedback('');
              setIsSubmittingGrade(false);

                                          }

              // Simulate API call



            }}
            className="group px-6 py-3 bg-gradient-to-r disabled:opacity-50 from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
            disabled={isSubmittingGrade}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              {isSubmittingGrade ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Grade
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        </SignedIn>
      </div>
    </>
  );
}
