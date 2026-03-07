"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { SkillRadarPoint } from "@/lib/types";

interface SkillRadarProps {
  data: SkillRadarPoint[];
}

export function SkillRadar({ data }: SkillRadarProps) {
  if (!data || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm p-6 text-center"
      >
        <p className="text-zinc-500 text-sm">No skill comparison for this job.</p>
      </motion.div>
    );
  }

  const chartData = data.map((d) => ({
    skill: d.skill.length > 12 ? d.skill.slice(0, 10) + "…" : d.skill,
    fullSkill: d.skill,
    "Your CV": d.cvLevel,
    "Job requirements": d.jobLevel,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm p-4 sm:p-6"
    >
      <h3 className="text-lg font-semibold text-zinc-200 mb-4">Skill fit</h3>
      <div className="h-[280px] sm:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#a1a1aa", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#71717a", fontSize: 10 }}
            />
            <Radar
              name="Your CV"
              dataKey="Your CV"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Radar
              name="Job requirements"
              dataKey="Job requirements"
              stroke="#52525b"
              fill="#52525b"
              fillOpacity={0.2}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.fullSkill ?? ""}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) => <span className="text-zinc-300">{value}</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
