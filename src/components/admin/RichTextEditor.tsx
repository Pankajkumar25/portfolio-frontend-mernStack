"use client";

import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-white/10">
        {[
          { cmd: "bold", label: "B" },
          { cmd: "italic", label: "I", style: "italic" },
          { cmd: "underline", label: "U", style: "text-decoration: underline" },
          { cmd: "insertUnorderedList", label: "UL" },
          { cmd: "insertOrderedList", label: "OL" },
          { cmd: "formatBlock", value: "h2", label: "H2" },
          { cmd: "formatBlock", value: "h3", label: "H3" },
          { cmd: "formatBlock", value: "p", label: "P" },
        ].map((btn) => (
          <button
            key={btn.cmd + (btn.value || "")}
            type="button"
            onMouseDown={(e) => { e.preventDefault(); execCommand(btn.cmd, btn.value); }}
            className="px-3 py-1 text-sm glass rounded hover:text-primary transition-colors"
            style={btn.style ? { fontWeight: "bold" } : {}}
          >
            {btn.label}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[200px] p-4 text-sm text-white focus:outline-none overflow-y-auto"
        data-placeholder={placeholder}
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}
