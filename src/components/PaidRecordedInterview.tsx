"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock, Mic, Sparkles, Video } from "lucide-react";

const INTERVIEW_PRICE_ALBUCKS = 15;
const DEFAULT_ACCESS_CODE = "INT-13";

const SAMPLE_QUESTIONS = [
  "Tell us about a project you're proud of.",
  "Why this internship and why this company?",
  "Describe a time you solved a problem as a team.",
];

export function PaidRecordedInterview() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessCode = useMemo(
    () => process.env.NEXT_PUBLIC_INTERVIEW_CODE ?? DEFAULT_ACCESS_CODE,
    []
  );

  const handleUnlock = () => {
    if (!code.trim()) {
      setError("Enter your access code.");
      return;
    }
    if (code.trim().toUpperCase() !== accessCode.toUpperCase()) {
      setError("Invalid code. Ask at the Gateway booth.");
      return;
    }
    setError(null);
    setUnlocked(true);
  };

  return (
    <section id="recorded-interview" className="mt-8">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_55%)]" />
          <CardHeader className="relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-sky-300/80">
              <Sparkles className="size-4" />
              Recorded interview
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              Asynchronous interview simulation
            </CardTitle>
            <p className="text-sm text-zinc-400">
              Video or audio answers + tailored questions + instant feedback.
            </p>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-3xl font-semibold text-zinc-50">
                {INTERVIEW_PRICE_ALBUCKS} ALBUCK$
              </div>
              <div className="text-sm text-zinc-400">~ {INTERVIEW_PRICE_ALBUCKS} EUR</div>
              <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-200">
                Available March 13, 2026 at the live salon
              </span>
            </div>
            <div className="grid gap-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <Video className="size-4 text-sky-300" />
                Record on video or audio, anytime
              </div>
              <div className="flex items-center gap-2">
                <Mic className="size-4 text-sky-300" />
                3 to 5 job-specific questions
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                Feedback + score in under 2 minutes
              </div>
            </div>
            <p className="text-xs text-zinc-500">
              Pay in ALBUCK$ at the Gateway booth. You'll receive an access code on site.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-5 text-sky-300" />
              {unlocked ? "Access unlocked" : "Access locked"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!unlocked && (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400" htmlFor="interview-code">
                    Access code
                  </label>
                  <input
                    id="interview-code"
                    value={code}
                    onChange={(event) => {
                      setCode(event.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g., INT-13"
                    className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20"
                  />
                  {error && <p className="text-xs text-rose-400">{error}</p>}
                </div>
                <Button className="w-full" onClick={handleUnlock}>
                  Unlock recorded interview
                </Button>
                <div className="rounded-lg border border-dashed border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-500">
                  Pay at the Gateway booth on March 13.
                </div>
              </>
            )}

            <div className="grid gap-2 text-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Question preview
              </div>
              <div
                className={`grid gap-2 ${
                  unlocked ? "text-zinc-100" : "text-zinc-400 blur-sm select-none"
                }`}
              >
                {SAMPLE_QUESTIONS.map((question) => (
                  <div key={question} className="rounded-lg border border-white/5 bg-zinc-950/40 px-3 py-2">
                    {question}
                  </div>
                ))}
              </div>
              {unlocked && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                  Access granted. We'll activate your recording flow now.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
