import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { AnalysisResult, MatchWithOutreach, SkillRadarPoint, ExperienceBoostItem } from "@/lib/types";
import { FEATURED_JOBS } from "@/lib/featured-jobs";

const MAX_CV_LENGTH = 12000;

const COMPANY_LIST =
  "L'Oréal, Red Bull, Google, Deloitte, McKinsey & Company, Amazon, Microsoft, Apple, Unilever, Nestlé, Procter & Gamble, Tesla, Netflix, Spotify, Accenture";

function buildSystemPrompt(jobLabel: string): string {
  return `You are an expert recruiter for Gen-Z. Compare this CV to the following internship role: **${jobLabel}**. The candidate is a B1 student (early career).

Return ONLY a valid JSON object (no markdown, no extra text) with:
- **score** (int 0–100): fit for this specific role.
- **roast** (string): one witty, punchy line using Gen-Z slang where appropriate (e.g. 'no cap', 'slay', 'it's giving'). Keep it credible and career-focused.
- **strengths** (array of strings): relevant to this job.
- **weaknesses** (array of strings): gaps specific to THIS role. NEVER say they lack "full-time experience" or "years of experience". Instead say how to leverage "academic projects", "group work", "soft skills", or "extracurriculars" to match the job.
- **magic_fix** (array of exactly 3 strings): improved bullet points for the CV, specific to the ${jobLabel} role.
- **matches** (array of exactly 2 strings): company names. Choose ONLY from: ${COMPANY_LIST}. Pick the 2 best fits for this candidate.
- **skill_radar** (array of 5–6 objects): each { "skill": string, "cvLevel": number 0–100, "jobLevel": number 0–100 }. Skills relevant to the job (e.g. Communication, Teamwork, Problem-solving, Technical skills, Initiative).
- **experience_boost** (array of 3–5 objects): each { "original": string (hobby/school project as in CV), "suggested": string (professional bullet for this job) }.
- **matches_outreach** (array of exactly 2 objects): one per match company, each { "company": string (same as in matches), "subject_line": string (email subject for recruiter), "hook": string (opening line), "value": string (what candidate brings), "cta": string (call-to-action) }. Tailored to CV and ${jobLabel}.`;
}

const FALLBACK_SYSTEM_PROMPT = `You are an expert recruiter for Gen-Z. Analyze this CV. Return ONLY a valid JSON object (no markdown) with: **score** (int 0–100), **roast** (string, witty Gen-Z line), **strengths** (array), **weaknesses** (array; never say "full-time experience"—use academic/soft skills instead), **magic_fix** (array of 3 strings), **matches** (array of exactly 2 strings from: ${COMPANY_LIST}), **skill_radar** (array of 5–6 { skill, cvLevel, jobLevel }), **experience_boost** (array of 3–5 { original, suggested }), **matches_outreach** (array of 2 { company, subject_line, hook, value, cta }).`;

function parseAnalysisJson(content: string): AnalysisResult | null {
  const trimmed = content.trim();
  const jsonStr = trimmed.replace(/^```json\s*|\s*```$/g, "").trim();
  try {
    const data = JSON.parse(jsonStr);
    if (
      typeof data.score !== "number" ||
      typeof data.roast !== "string" ||
      !Array.isArray(data.strengths) ||
      !Array.isArray(data.weaknesses) ||
      !Array.isArray(data.magic_fix) ||
      !Array.isArray(data.matches)
    ) {
      return null;
    }

    const skill_radar: SkillRadarPoint[] = Array.isArray(data.skill_radar)
      ? data.skill_radar
          .filter((s: unknown) => s && typeof (s as SkillRadarPoint).skill === "string" && typeof (s as SkillRadarPoint).cvLevel === "number" && typeof (s as SkillRadarPoint).jobLevel === "number")
          .map((s: SkillRadarPoint) => ({ skill: (s as SkillRadarPoint).skill, cvLevel: Math.min(100, Math.max(0, (s as SkillRadarPoint).cvLevel)), jobLevel: Math.min(100, Math.max(0, (s as SkillRadarPoint).jobLevel)) }))
      : [];

    const experience_boost: ExperienceBoostItem[] = Array.isArray(data.experience_boost)
      ? data.experience_boost
          .filter((e: unknown) => e && typeof (e as ExperienceBoostItem).original === "string" && typeof (e as ExperienceBoostItem).suggested === "string")
          .map((e: ExperienceBoostItem) => ({ original: (e as ExperienceBoostItem).original, suggested: (e as ExperienceBoostItem).suggested }))
      : [];

    let matches_outreach: MatchWithOutreach[] = [];
    if (Array.isArray(data.matches_outreach) && data.matches_outreach.length >= 2) {
      matches_outreach = data.matches.slice(0, 2).map((company: string, i: number) => {
        const o = data.matches_outreach[i];
        return {
          company,
          subject_line: typeof o?.subject_line === "string" ? o.subject_line : "",
          hook: typeof o?.hook === "string" ? o.hook : "",
          value: typeof o?.value === "string" ? o.value : "",
          cta: typeof o?.cta === "string" ? o.cta : "",
        };
      });
    } else {
      matches_outreach = data.matches.slice(0, 2).map((company: string) => ({
        company,
        subject_line: "",
        hook: "",
        value: "",
        cta: "",
      }));
    }

    return {
      score: Math.min(100, Math.max(0, data.score)),
      roast: data.roast,
      strengths: data.strengths.map(String),
      weaknesses: data.weaknesses.map(String),
      magic_fix: data.magic_fix.slice(0, 3).map(String),
      matches: data.matches.slice(0, 2).map(String),
      skill_radar: skill_radar.length > 0 ? skill_radar : undefined,
      experience_boost: experience_boost.length > 0 ? experience_boost : undefined,
      matches_outreach: matches_outreach.length > 0 ? matches_outreach : undefined,
    };
  } catch {
    return null;
  }
}

function getJobLabel(jobId: string | null, jobName: string | null): string {
  if (jobId) {
    const job = FEATURED_JOBS.find((j) => j.id === jobId);
    if (job) return job.role ? `${job.name} – ${job.role}` : job.name;
  }
  if (jobName && typeof jobName === "string" && jobName.trim()) return jobName.trim();
  return "";
}

export async function POST(request: NextRequest) {
  try {
    let cvText: string;
    let jobId: string | null = null;
    let jobName: string | null = null;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      cvText = typeof body.cvText === "string" ? body.cvText : "";
      jobId = typeof body.jobId === "string" ? body.jobId : null;
      jobName = typeof body.jobName === "string" ? body.jobName : null;
    } else {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const textField = formData.get("cvText");
      const jobIdField = formData.get("jobId");
      const jobNameField = formData.get("jobName");
      jobId = typeof jobIdField === "string" ? jobIdField : null;
      jobName = typeof jobNameField === "string" ? jobNameField : null;

      if (file?.size && file.type === "application/pdf") {
        const mod = await import("pdf-parse");
        const pdfParse = mod.default ?? mod;
        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdfParse(buffer);
        cvText = typeof data.text === "string" ? data.text : "";
      } else if (typeof textField === "string" && textField.trim()) {
        cvText = textField.trim();
      } else {
        return NextResponse.json(
          { error: "Provide either a PDF file or cvText in the request." },
          { status: 400 }
        );
      }
    }

    if (!cvText || cvText.length < 10) {
      return NextResponse.json(
        { error: "CV text is too short or missing." },
        { status: 400 }
      );
    }

    const truncated =
      cvText.length > MAX_CV_LENGTH
        ? cvText.slice(0, MAX_CV_LENGTH) + "\n[...truncated]"
        : cvText;

    const jobLabel = getJobLabel(jobId, jobName);
    const systemPrompt = jobLabel ? buildSystemPrompt(jobLabel) : FALLBACK_SYSTEM_PROMPT;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: truncated },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";
    const result = parseAnalysisJson(content);
    if (!result) {
      return NextResponse.json(
        { error: "Invalid analysis response from AI." },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
