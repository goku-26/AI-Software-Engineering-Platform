import React from 'react';
import Editor from '@monaco-editor/react';

export const CodeEditor = ({
  value,
  language = 'javascript',
  onChange,
  readOnly = false,
  height = '100%',
}) => {
  return (
    <div className="w-full h-full bg-[#0E1116] overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        theme="vs-dark"
        onChange={onChange}
        options={{
          readOnly,
          minimap: { enabled: true },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
};
