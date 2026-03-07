export interface FeaturedJob {
  id: string;
  name: string;
  role?: string;
}

export interface SkillRadarPoint {
  skill: string;
  cvLevel: number;
  jobLevel: number;
}

export interface ExperienceBoostItem {
  original: string;
  suggested: string;
}

export interface ProOutreach {
  subject_line: string;
  hook: string;
  value: string;
  cta: string;
}

export interface MatchWithOutreach {
  company: string;
  recruiter?: string;
  subject_line?: string;
  hook?: string;
  value?: string;
  cta?: string;
}

export interface AnalysisResult {
  score: number;
  roast: string;
  strengths: string[];
  weaknesses: string[];
  magic_fix: string[];
  matches: string[];
  skill_radar?: SkillRadarPoint[];
  experience_boost?: ExperienceBoostItem[];
  /** When job-aware, each match can include Pro Outreach (subject_line, hook, value, cta). */
  matches_outreach?: MatchWithOutreach[];
}
