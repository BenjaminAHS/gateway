"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";
import type { ExperienceBoostItem } from "@/lib/types";

interface ExperienceTranslatorProps {
  items: ExperienceBoostItem[];
}

export function ExperienceTranslator({ items }: ExperienceTranslatorProps) {
  if (!items || items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-violet-400" />
        Boost your Experience
      </h3>
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
          >
            <Card className="overflow-hidden border-white/10 bg-zinc-900/80">
              <CardContent className="p-4 sm:p-5">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-start">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                      Original
                    </p>
                    <p className="text-zinc-300 text-sm">{item.original}</p>
                  </div>
                  <div className="flex justify-center pt-6 md:pt-8">
                    <ArrowRight className="w-5 h-5 text-violet-400 shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-violet-400 uppercase tracking-wide mb-1">
                      Suggested
                    </p>
                    <p className="text-zinc-200 text-sm">{item.suggested}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
