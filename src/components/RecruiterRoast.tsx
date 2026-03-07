"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface RecruiterRoastProps {
  roast: string;
}

export function RecruiterRoast({ roast }: RecruiterRoastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="border-l-4 border-l-violet-500 bg-zinc-900/80 overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex gap-3">
          <MessageCircle className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
          <p className="text-zinc-200 text-sm sm:text-base italic leading-relaxed">
            &ldquo;{roast}&rdquo;
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
