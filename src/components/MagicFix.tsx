"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface MagicFixProps {
  magic_fix: string[];
}

export function MagicFix({ magic_fix }: MagicFixProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-violet-400">Magic Fix</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-3 text-sm text-zinc-300">
            {magic_fix.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-violet-400" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
