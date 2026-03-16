"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Check, Lock, Sparkles, Star } from "lucide-react";

const HUMAN_INTERVIEW_PRICE_ALBUCKS = 30;
const DEFAULT_ACCESS_CODE = "HUM-13";

const FEEDBACK_ITEMS = [
  "Structured feedback scorecard",
  "Strengths + top 3 improvements",
  "Delivery, clarity, and fit",
  "Actionable next-step checklist",
];

export function PaidHumanMockInterview() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessCode = useMemo(
    () => process.env.NEXT_PUBLIC_HUMAN_INTERVIEW_CODE ?? DEFAULT_ACCESS_CODE,
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
    <section id="human-mock-interview" className="mt-8">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.2),_transparent_55%)]" />
          <CardHeader className="relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-pink-300/80">
              <Sparkles className="size-4" />
              Premium human mock interview
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              Live interview with a real recruiter
            </CardTitle>
            <p className="text-sm text-zinc-400">
              Book a 30-minute session with a pro recruiter of our team and get structured feedback fast.
            </p>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-3xl font-semibold text-zinc-50">
                {HUMAN_INTERVIEW_PRICE_ALBUCKS} ALBUCK$
              </div>
              <div className="text-sm text-zinc-400">~ {HUMAN_INTERVIEW_PRICE_ALBUCKS} EUR</div>
              <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs text-pink-200">
                Available March 13, 2026 at the live salon
              </span>
            </div>
            <div className="grid gap-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <Star className="size-4 text-pink-300" />
                Human interviewer matched to your role
              </div>
              <div className="flex items-center gap-2">
                <CalendarCheck className="size-4 text-pink-300" />
                30-minute booking in the next 48h
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                Structured feedback report within 24h
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
              <Lock className="size-5 text-pink-300" />
              {unlocked ? "Access unlocked" : "Access locked"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!unlocked && (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400" htmlFor="human-interview-code">
                    Access code
                  </label>
                  <input
                    id="human-interview-code"
                    value={code}
                    onChange={(event) => {
                      setCode(event.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g., HUM-13"
                    className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-pink-400/60 focus:ring-2 focus:ring-pink-400/20"
                  />
                  {error && <p className="text-xs text-rose-400">{error}</p>}
                </div>
                <Button className="w-full" onClick={handleUnlock}>
                  Unlock human mock interview
                </Button>
                <div className="rounded-lg border border-dashed border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-500">
                  Pay at the Gateway booth on March 13.
                </div>
              </>
            )}

            {unlocked && (
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Book your slot
                </div>
                <div className="space-y-2 text-sm text-zinc-300">
                  {FEEDBACK_ITEMS.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Check className="size-4 text-emerald-400" />
                      {item}
                    </div>
                  ))}
                </div>
                <Button className="w-full">Request a booking</Button>
                <div className="text-xs text-zinc-500">
                  We will confirm your time slot by email.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
