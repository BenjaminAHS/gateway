"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, FileText } from "lucide-react";

type Mode = "upload" | "paste";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onPasteSubmit: (text: string) => void;
  error: string | null;
  disabled?: boolean;
}

export function UploadZone({
  onFileSelect,
  onPasteSubmit,
  error,
  disabled = false,
}: UploadZoneProps) {
  const [mode, setMode] = useState<Mode>("upload");
  const [pasteText, setPasteText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file?.type === "application/pdf") {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file?.type === "application/pdf") {
        onFileSelect(file);
      }
      e.target.value = "";
    },
    [onFileSelect]
  );

  const handlePasteSubmit = useCallback(() => {
    const text = pasteText.trim();
    if (text.length >= 10) {
      onPasteSubmit(text);
    }
  }, [pasteText, onPasteSubmit]);

  return (
    <Card className="glass max-w-2xl mx-auto overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex-1 min-h-[44px] rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              mode === "upload"
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/40"
                : "text-zinc-400 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            <FileUp className="w-4 h-4" />
            Upload PDF
          </button>
          <button
            type="button"
            onClick={() => setMode("paste")}
            className={`flex-1 min-h-[44px] rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              mode === "paste"
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/40"
                : "text-zinc-400 hover:text-zinc-300 hover:bg-white/5"
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste text
          </button>
        </div>

        {mode === "upload" ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-colors min-h-[160px] flex flex-col items-center justify-center ${
              dragActive
                ? "border-violet-500 bg-violet-500/10"
                : "border-zinc-600 hover:border-zinc-500 hover:bg-white/5"
            } ${disabled ? "pointer-events-none opacity-60" : ""}`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              onChange={handleChange}
              className="hidden"
            />
            <FileUp className="w-10 h-10 text-violet-400 mb-3" />
            <p className="text-zinc-300 text-sm sm:text-base">
              Drag & drop your CV (PDF) here, or click to browse
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              placeholder="Paste your CV text here..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              disabled={disabled}
              className="w-full min-h-[160px] rounded-lg bg-zinc-900/80 border border-white/10 px-4 py-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y text-sm sm:text-base"
              aria-label="Paste your CV text"
            />
            <Button
              onClick={handlePasteSubmit}
              disabled={disabled || pasteText.trim().length < 10}
              className="w-full"
            >
              Analyze pasted CV
            </Button>
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
