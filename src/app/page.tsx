"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { JobSelector } from "@/components/JobSelector";
import { UploadZone } from "@/components/UploadZone";
import { ProcessingState } from "@/components/ProcessingState";
import { Dashboard } from "@/components/Dashboard";
import { PaidPortfolioAccess } from "@/components/PaidPortfolioAccess";
import { PaidContactDiscovery } from "@/components/PaidContactDiscovery";
import { PaidRecordedInterview } from "@/components/PaidRecordedInterview";
import { PaidHumanMockInterview } from "@/components/PaidHumanMockInterview";
import { PaidPriorityApplication } from "@/components/PaidPriorityApplication";
import { PaidBundles } from "@/components/PaidBundles";
import type { AnalysisResult, FeaturedJob } from "@/lib/types";

type Status = "idle" | "processing" | "analyzed";

export default function Home() {
  const [selectedJob, setSelectedJob] = useState<FeaturedJob | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const reset = searchParams.get("reset");
    if (reset === "1") {
      setSelectedJob(null);
      setStatus("idle");
      setAnalysis(null);
      setError(null);
      router.replace("/", { scroll: true });
    }
  }, [searchParams, router]);

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
        <div className="mt-6 mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            CV analysis
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
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

        <div className="mt-10 mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Priority application
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <PaidPriorityApplication />

        <div className="mt-10 mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Portfolio access
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <PaidPortfolioAccess />

        <div className="mt-10 mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Contact discovery
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <PaidContactDiscovery />

        <div className="mt-10 mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Recorded interview
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <PaidRecordedInterview />

        <div className="mt-10 mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Human mock interview
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <PaidHumanMockInterview />

        <div className="mt-10 mb-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Bundle packs
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <PaidBundles />
      </main>
    </div>
  );
}
