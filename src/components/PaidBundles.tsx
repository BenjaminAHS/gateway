"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const BUNDLES = [
  {
    name: "Starter Pack",
    price: 40,
    accent: "text-amber-300/80",
    badge: "Best for quick wins",
    features: [
      "CV analysis (score + fixes)",
      "Priority Application Pack",
      "Recorded interview (async)",
      "Boost your Experience (all improvements)",
      "Critical Fixes (all fixes)",
    ],
  },
  {
    name: "Pro Pack",
    price: 80,
    accent: "text-sky-300/80",
    badge: "Most popular",
    features: [
      "Everything in Starter Pack",
      "Real companies portfolio (30)",
      "Contact discovery (recruiters + emails)",
      "Company fit cheat-sheet",
      "Interview answer bank",
      "LinkedIn upgrade copy",
    ],
  },
  {
    name: "Urgent Pack",
    price: 100,
    accent: "text-pink-300/80",
    badge: "All features unlocked",
    features: [
      "Everything in Pro Pack",
      "Human mock interview (30 min)",
      "Priority booking (within 24h)",
      "Fast-track feedback within 24h",
    ],
  },
];

export function PaidBundles() {
  return (
    <section id="bundles" className="mt-12 pb-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-100">
          Bundle packs to reach 100 ALBUCK$
        </h2>
        <p className="text-sm text-zinc-400 mt-2">
          Choose a pack and get everything unlocked on the spot.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {BUNDLES.map((bundle) => (
          <Card key={bundle.name} className="relative overflow-hidden">
            <CardHeader>
              <div className={`text-xs uppercase tracking-[0.2em] ${bundle.accent}`}>
                {bundle.badge}
              </div>
              <CardTitle className="text-xl">{bundle.name}</CardTitle>
              <div className="text-3xl font-semibold text-zinc-50">
                {bundle.price} ALBUCK$
              </div>
              <div className="text-xs text-zinc-500">~ {bundle.price} EUR</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-zinc-300">
                {bundle.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="size-4 text-emerald-400 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full gap-2">
                <Sparkles className="size-4" />
                Get this pack at the booth
              </Button>
              <div className="text-xs text-zinc-500">
                Available March 13, 2026 at the live salon.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
