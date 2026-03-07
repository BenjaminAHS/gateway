"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { AnalysisResult, FeaturedJob } from "@/lib/types";
import { EmployabilityScore } from "./EmployabilityScore";
import { RecruiterRoast } from "./RecruiterRoast";
import { StrengthsAndFixes } from "./StrengthsAndFixes";
import { MagicFix } from "./MagicFix";
import { SkillRadar } from "./SkillRadar";
import { ExperienceTranslator } from "./ExperienceTranslator";
import { GatewayCertifiedBadge } from "./GatewayCertifiedBadge";
import { Matchmaker } from "./Matchmaker";
import { InterviewSimulator } from "./InterviewSimulator";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface DashboardProps {
  analysis: AnalysisResult;
  selectedJob?: FeaturedJob | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export function Dashboard({ analysis, selectedJob = null }: DashboardProps) {
  const [interviewOpen, setInterviewOpen] = useState(false);

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-4xl mx-auto px-4 pb-12 sm:pb-16 space-y-8 sm:space-y-10"
      >
        <motion.section
          variants={sectionVariants}
          className="flex flex-col items-center justify-center pt-4 gap-6"
        >
          <EmployabilityScore score={analysis.score} />
          <GatewayCertifiedBadge score={analysis.score} job={selectedJob} />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <RecruiterRoast roast={analysis.roast} />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-zinc-200">Start Mock Interview</h3>
            <Button
              onClick={() => setInterviewOpen(true)}
              variant="outline"
              className="gap-2 min-h-[44px] w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4" />
              Start Mock Interview
            </Button>
          </div>
        </motion.section>

        {analysis.skill_radar && analysis.skill_radar.length > 0 && (
          <motion.section variants={sectionVariants}>
            <SkillRadar data={analysis.skill_radar} />
          </motion.section>
        )}

        <motion.section variants={sectionVariants}>
          <StrengthsAndFixes
            strengths={analysis.strengths}
            weaknesses={analysis.weaknesses}
          />
        </motion.section>

        <motion.section variants={sectionVariants}>
          <MagicFix magic_fix={analysis.magic_fix} />
        </motion.section>

        {analysis.experience_boost && analysis.experience_boost.length > 0 && (
          <motion.section variants={sectionVariants}>
            <ExperienceTranslator items={analysis.experience_boost} />
          </motion.section>
        )}

        <motion.section variants={sectionVariants}>
          <Matchmaker
            matches={analysis.matches}
            matchesOutreach={analysis.matches_outreach}
          />
        </motion.section>
      </motion.div>

      {interviewOpen && (
        <InterviewSimulator
          selectedJob={selectedJob}
          analysis={analysis}
          onClose={() => setInterviewOpen(false)}
        />
      )}
    </>
  );
}
