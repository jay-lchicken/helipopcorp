"use client";

import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from "react";

const ANSI_COLORS = {
  "30": "#000000",
  "31": "#e06c75",
  "32": "#98c379",
  "33": "#e5c07b",
  "34": "#61afef",
  "35": "#c678dd",
  "36": "#56b6c2",
  "37": "#e0e0e0",
  "90": "#7f8c8d",
  "91": "#e06c75",
  "92": "#98c379",
  "93": "#e5c07b",
  "94": "#61afef",
  "95": "#c678dd",
  "96": "#56b6c2",
  "97": "#ffffff",
};

function parseAnsi(text) {
  const segments = [];
  const regex = /\x1b\[([0-9;]*)m/g;
  let lastIndex = 0;
  let currentColor = null;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), color: currentColor });
    }
    const code = match[1];
    if (code === "0" || code === "") {
      currentColor = null;
    } else {
      const codes = code.split(";");
      for (const c of codes) {
        if (ANSI_COLORS[c]) {
          currentColor = ANSI_COLORS[c];
        } else if (c === "0") {
          currentColor = null;
        }
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), color: currentColor });
  }

  return segments;
}

const TerminalOutput = forwardRef(function TerminalOutput({ className, style }, ref) {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  useImperativeHandle(ref, () => ({
    write(text) {
      const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      const newLines = normalized.split("\n");
      setLines((prev) => {
        const updated = [...prev];
        if (updated.length === 0) {
          updated.push("");
        }
        // Append first segment to the last existing line
        updated[updated.length - 1] += newLines[0];
        // Add remaining segments as new lines
        for (let i = 1; i < newLines.length; i++) {
          updated.push(newLines[i]);
        }
        return updated;
      });
    },
    clear() {
      setLines([]);
    },
  }));

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        backgroundColor: "#1a1a1a",
        color: "#e0e0e0",
        fontFamily: '"Fira Mono", "Monaco", "Consolas", monospace',
        fontSize: "13px",
        lineHeight: "1.4",
        padding: "8px 12px",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        ...style,
      }}
    >
      {lines.map((line, i) => {
        const segments = parseAnsi(line);
        return (
          <div key={i} style={{ minHeight: "1.4em" }}>
            {segments.map((seg, j) => (
              <span key={j} style={seg.color ? { color: seg.color } : undefined}>
                {seg.text}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
});

export default TerminalOutput;
