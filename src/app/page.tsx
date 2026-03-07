"use client";

import { useState, useCallback } from "react";
import { HeroSection } from "@/components/HeroSection";
import { JobSelector } from "@/components/JobSelector";
import { UploadZone } from "@/components/UploadZone";
import { ProcessingState } from "@/components/ProcessingState";
import { Dashboard } from "@/components/Dashboard";
import type { AnalysisResult, FeaturedJob } from "@/lib/types";

type Status = "idle" | "processing" | "analyzed";

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<FeaturedJob | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeWithFile = useCallback(
    async (file: File) => {
      if (!selectedJob) return;
      setError(null);
      setStatus("processing");
      try {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("jobId", selectedJob.id);
        if (selectedJob.name) formData.set("jobName", selectedJob.name);
        const res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Analysis failed.");
          setStatus("idle");
          return;
        }
        setAnalysis(data as AnalysisResult);
        setStatus("analyzed");
      } catch {
        setError("Network error. Please try again.");
        setStatus("idle");
      }
    },
    [selectedJob]
  );

  const analyzeWithPaste = useCallback(
    async (text: string) => {
      if (!selectedJob) return;
      setError(null);
      setStatus("processing");
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cvText: text,
            jobId: selectedJob.id,
            jobName: selectedJob.name,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Analysis failed.");
          setStatus("idle");
          return;
        }
        setAnalysis(data as AnalysisResult);
        setStatus("analyzed");
      } catch {
        setError("Network error. Please try again.");
        setStatus("idle");
      }
    },
    [selectedJob]
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 overflow-x-hidden">
      <HeroSection />

      <main className="container max-w-5xl mx-auto px-4 pb-8">
        {!selectedJob && (
          <JobSelector onSelect={setSelectedJob} />
        )}

        {selectedJob && status === "idle" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-zinc-400 text-sm">Selected:</span>
              <span className="text-violet-400 font-medium">
                {selectedJob.name}
                {selectedJob.role ? ` – ${selectedJob.role}` : ""}
              </span>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm underline"
              >
                Change
              </button>
            </div>
            <UploadZone
              onFileSelect={analyzeWithFile}
              onPasteSubmit={analyzeWithPaste}
              error={error}
            />
          </div>
        )}

        {status === "processing" && <ProcessingState />}

        {status === "analyzed" && analysis && (
          <Dashboard analysis={analysis} selectedJob={selectedJob} />
        )}
      </main>
    </div>
  );
}
