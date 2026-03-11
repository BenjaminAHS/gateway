"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import type { FeaturedJob } from "@/lib/types";
import { FEATURED_JOBS } from "@/lib/featured-jobs";

interface JobSelectorProps {
  onSelect: (job: FeaturedJob) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function JobSelector({ onSelect }: JobSelectorProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100">
          Choose an internship to match your CV against
        </h2>
        <p className="mt-2 text-zinc-400 text-sm sm:text-base">
          Get a job-specific score and instant feedback
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(FEATURED_JOBS as FeaturedJob[]).map((job) => (
          <motion.div key={job.id} variants={item}>
            <Card className="h-full rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm overflow-hidden hover:border-violet-500/40 transition-colors">
              <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-semibold text-zinc-100 text-sm sm:text-base">
                  {job.name}
                </h3>
                {job.role && (
                  <p className="text-zinc-500 text-xs sm:text-sm mt-0.5">
                    {job.role}
                  </p>
                )}
                <div className="mt-auto pt-4">
                  <Button
                    onClick={() => onSelect(job)}
                    className="w-full min-h-[44px]"
                  >
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
