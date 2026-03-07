"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Copy, Check } from "lucide-react";
import type { FeaturedJob } from "@/lib/types";

interface GatewayCertifiedBadgeProps {
  score: number;
  job?: FeaturedJob | null;
}

export function GatewayCertifiedBadge({ score, job }: GatewayCertifiedBadgeProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/certified?job=${encodeURIComponent(job?.name ?? "")}&score=${score}`
      : "";

  const copyLink = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [shareUrl]);

  if (score <= 80) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
    >
      <Card className="overflow-hidden border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent">
        <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
            <Award className="w-8 h-8 text-violet-400" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-zinc-100 text-lg">Gateway Certified</h3>
            <p className="text-zinc-400 text-sm mt-0.5">
              {job ? `Ready for ${job.name}${job.role ? ` – ${job.role}` : ""}` : "You're internship-ready."}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={copyLink}
            className="gap-2 min-h-[44px] shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy link
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
