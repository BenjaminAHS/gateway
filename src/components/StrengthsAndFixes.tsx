"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, AlertTriangle, Lock } from "lucide-react";

interface StrengthsAndFixesProps {
  strengths: string[];
  weaknesses: string[];
}

export function StrengthsAndFixes({ strengths, weaknesses }: StrengthsAndFixesProps) {
  const [fixesUnlocked, setFixesUnlocked] = useState(false);
  const maxFreeFixes = 1;

  const visibleWeaknesses = useMemo(
    () => (fixesUnlocked ? weaknesses : weaknesses.slice(0, maxFreeFixes)),
    [fixesUnlocked, weaknesses]
  );
  const hiddenCount = Math.max(weaknesses.length - visibleWeaknesses.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="h-full overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-emerald-400">
              <ThumbsUp className="w-4 h-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2 text-sm text-zinc-300">
              {strengths.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-500 shrink-0">*</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="h-full overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              Critical Fixes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2 text-sm text-zinc-300">
              {visibleWeaknesses.map((w, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-500 shrink-0">*</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
            {!fixesUnlocked && hiddenCount > 0 && (
              <div className="mt-4 rounded-lg border border-white/10 bg-zinc-950/60 px-3 py-3 text-xs text-zinc-400">
                Unlock all improvements to see {hiddenCount} more critical fixes.
              </div>
            )}
            {!fixesUnlocked && hiddenCount > 0 && (
              <Button
                variant="outline"
                className="mt-3 w-full gap-2"
                onClick={() => setFixesUnlocked(true)}
              >
                <Lock className="w-4 h-4" />
                Unlock all improvements for 5 ALBUCK$
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
