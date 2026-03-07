"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThumbsUp, AlertTriangle } from "lucide-react";

interface StrengthsAndFixesProps {
  strengths: string[];
  weaknesses: string[];
}

export function StrengthsAndFixes({ strengths, weaknesses }: StrengthsAndFixesProps) {
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
                  <span className="text-emerald-500 shrink-0">•</span>
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
              {weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-500 shrink-0">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
