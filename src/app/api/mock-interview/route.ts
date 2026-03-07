import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export type MockInterviewAction = "questions" | "feedback";

/** POST body: { jobLabel, cvSummary, action: "questions" | "feedback", answers?: string[] } */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const jobLabel = typeof body.jobLabel === "string" ? body.jobLabel : "";
    const cvSummary = typeof body.cvSummary === "string" ? body.cvSummary : "";
    const action: MockInterviewAction = body.action === "feedback" ? "feedback" : "questions";
    const answers = Array.isArray(body.answers) ? body.answers.filter((a: unknown) => typeof a === "string") : [];

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key is not configured." }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    if (action === "questions") {
      const systemPrompt = `You are a recruiter conducting a mock interview for the role: ${jobLabel}. The candidate's CV summary: ${cvSummary.slice(0, 2000)}. Generate exactly 3 interview questions tailored to this role and this candidate. Return ONLY a valid JSON object: { "questions": [ "question1", "question2", "question3" ] }. No markdown, no extra text.`;
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate the 3 questions." },
        ],
        temperature: 0.7,
      });
      const content = completion.choices[0]?.message?.content?.trim() || "";
      const parsed = parseQuestionsJson(content);
      if (!parsed) {
        return NextResponse.json({ error: "Invalid questions response." }, { status: 500 });
      }
      return NextResponse.json(parsed);
    }

    // feedback
    const systemPrompt = `You are a recruiter giving brief, constructive mock interview feedback. Role: ${jobLabel}. The candidate answered 3 questions. Give a short Performance Feedback (2–4 sentences): what went well, and 1–2 specific improvement tips. Keep tone witty but credible and career-focused (Gen-Z friendly). Return ONLY a valid JSON object: { "feedback": "your feedback text here" }. No markdown.`;
    const userContent = answers.length
      ? `Question 1 answer: ${answers[0]}\nQuestion 2 answer: ${answers[1] ?? ""}\nQuestion 3 answer: ${answers[2] ?? ""}`
      : "No answers provided.";
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.7,
    });
    const content = completion.choices[0]?.message?.content?.trim() || "";
    const feedbackParsed = parseFeedbackJson(content);
    if (!feedbackParsed) {
      return NextResponse.json({ error: "Invalid feedback response." }, { status: 500 });
    }
    return NextResponse.json(feedbackParsed);
  } catch (err) {
    console.error("Mock interview API error:", err);
    return NextResponse.json({ error: "Mock interview failed." }, { status: 500 });
  }
}

function parseQuestionsJson(content: string): { questions: string[] } | null {
  const jsonStr = content.replace(/^```json\s*|\s*```$/g, "").trim();
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data.questions) || data.questions.length < 3) return null;
    return { questions: data.questions.slice(0, 3).map(String) };
  } catch {
    return null;
  }
}

function parseFeedbackJson(content: string): { feedback: string } | null {
  const jsonStr = content.replace(/^```json\s*|\s*```$/g, "").trim();
  try {
    const data = JSON.parse(jsonStr);
    if (typeof data.feedback !== "string") return null;
    return { feedback: data.feedback };
  } catch {
    return null;
  }
}
