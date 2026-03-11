"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock, Sparkles } from "lucide-react";

const PORTFOLIO_PRICE_ALBUCKS = 20;
const DEFAULT_ACCESS_CODE = "ALB-13";

const PORTFOLIO_COMPANIES = [
  "L'Oreal",
  "Deloitte",
  "Amazon",
  "Google",
  "Microsoft",
  "Red Bull",
  "BNP Paribas",
  "Accenture",
  "Salesforce",
  "PwC",
  "KPMG",
  "Capgemini",
];

export function PaidPortfolioAccess() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessCode = useMemo(
    () => process.env.NEXT_PUBLIC_PORTFOLIO_CODE ?? DEFAULT_ACCESS_CODE,
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
    <section id="portfolio-paywall" className="mt-6">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.25),_transparent_55%)]" />
          <CardHeader className="relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-violet-300/80">
              <Sparkles className="size-4" />
              Paid access
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              Real companies portfolio
            </CardTitle>
            <p className="text-sm text-zinc-400">
              For B1 International students who need an internship this summer, right now.
            </p>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-3xl font-semibold text-zinc-50">
                {PORTFOLIO_PRICE_ALBUCKS} ALBUCK$
              </div>
              <div className="text-sm text-zinc-400">~ {PORTFOLIO_PRICE_ALBUCKS} EUR</div>
              <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-200">
                Available March 13, 2026 at the live salon
              </span>
            </div>
            <div className="grid gap-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                30 companies that have hired B1 students
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                Useful contacts + outreach scripts
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                Instant access after payment
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
              <Lock className="size-5 text-violet-300" />
              {unlocked ? "Access unlocked" : "Access locked"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!unlocked && (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400" htmlFor="portfolio-code">
                    Access code
                  </label>
                  <input
                    id="portfolio-code"
                    value={code}
                    onChange={(event) => {
                      setCode(event.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g., ALB-13"
                    className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20"
                  />
                  {error && <p className="text-xs text-rose-400">{error}</p>}
                </div>
                <Button className="w-full" onClick={handleUnlock}>
                  Unlock the portfolio
                </Button>
                <div className="rounded-lg border border-dashed border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-500">
                  Need help? Visit the Gateway booth on March 13.
                </div>
              </>
            )}

            <div className="grid gap-2 text-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Company preview
              </div>
              <div
                className={`grid gap-2 ${
                  unlocked ? "text-zinc-100" : "text-zinc-400 blur-sm select-none"
                }`}
              >
                {PORTFOLIO_COMPANIES.map((company) => (
                  <div key={company} className="rounded-lg border border-white/5 bg-zinc-950/40 px-3 py-2">
                    {company}
                  </div>
                ))}
              </div>
              {unlocked && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                  Access granted. We'll send the full list (30) by email.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
