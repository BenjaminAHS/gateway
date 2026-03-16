"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock, Sparkles } from "lucide-react";

const DISCOVERY_PRICE_ALBUCKS = 15;
const DEFAULT_ACCESS_CODE = "CNT-13";

const SAMPLE_CONTACTS = [
  { name: "Camille D.", role: "Campus Recruiter", company: "Accenture" },
  { name: "Lucas R.", role: "Talent Acquisition", company: "Capgemini" },
  { name: "Sarah M.", role: "HR Internships", company: "L'Oreal" },
  { name: "Maxime L.", role: "People Ops", company: "Deloitte" },
];

export function PaidContactDiscovery() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessCode = useMemo(
    () => process.env.NEXT_PUBLIC_CONTACTS_CODE ?? DEFAULT_ACCESS_CODE,
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
    <section id="contact-discovery" className="mt-8">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.2),_transparent_55%)]" />
          <CardHeader className="relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-300/80">
              <Sparkles className="size-4" />
              Contact discovery
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              Find recruiters already inside the company
            </CardTitle>
            <p className="text-sm text-zinc-400">
              Chose a company you want to work in and it gives : names + roles + likely professional emails.
            </p>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-3xl font-semibold text-zinc-50">
                {DISCOVERY_PRICE_ALBUCKS} ALBUCK$
              </div>
              <div className="text-sm text-zinc-400">~ {DISCOVERY_PRICE_ALBUCKS} EUR</div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">
                Available March 13, 2026 at the live salon
              </span>
            </div>
            <div className="grid gap-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                5 to 12 qualified contacts per company
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                Estimated pro emails + outreach scripts
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-emerald-400" />
                Instant access after payment
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Legal note: we comply with GDPR and platform terms. Data comes from
              public sources and is used only for internship outreach.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-5 text-emerald-300" />
              {unlocked ? "Access unlocked" : "Access locked"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!unlocked && (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-zinc-400" htmlFor="contacts-code">
                    Access code
                  </label>
                  <input
                    id="contacts-code"
                    value={code}
                    onChange={(event) => {
                      setCode(event.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="e.g., CNT-13"
                    className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                  />
                  {error && <p className="text-xs text-rose-400">{error}</p>}
                </div>
                <Button className="w-full" onClick={handleUnlock}>
                  Unlock contacts
                </Button>
                <div className="rounded-lg border border-dashed border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-500">
                  Pay at the Gateway booth on March 13.
                </div>
              </>
            )}

            <div className="grid gap-2 text-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Preview
              </div>
              <div
                className={`grid gap-2 ${
                  unlocked ? "text-zinc-100" : "text-zinc-400 blur-sm select-none"
                }`}
              >
                {SAMPLE_CONTACTS.map((contact) => (
                  <div
                    key={`${contact.name}-${contact.company}`}
                    className="rounded-lg border border-white/5 bg-zinc-950/40 px-3 py-2"
                  >
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-xs text-zinc-400">
                      {contact.role} · {contact.company}
                    </div>
                  </div>
                ))}
              </div>
              {unlocked && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                  Access granted. We'll email the contacts to you.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
