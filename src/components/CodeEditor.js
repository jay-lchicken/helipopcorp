'use client';

import { useEffect, useRef } from 'react';

export default function CodeEditor() {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Configure Monaco base path
    window.require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs' } });

    window.require(['vs/editor/editor.main'], () => {
      window.monaco.editor.create(editorRef.current, {
        value: '// Welcome to KLC IDE\n',
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
      });
    });
  }, []);

  return (
    <div
      ref={editorRef}
      style={{ height: '90vh', width: '100%', border: '1px solid #333', borderRadius: '8px', marginTop: '1rem' }}
    />
  );
}
