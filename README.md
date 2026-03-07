# GATEWAY – Land Your First Internship

AI-powered **Internship Matcher** for international B1 students. Select a featured internship, upload your CV (PDF) or paste your CV text, and get a job-specific employability score, recruiter roast, skill radar, experience boost, magic fixes, and Pro Referral outreach copy.

## Tech stack

- **Next.js** (App Router), **TypeScript**, **Tailwind CSS**
- **Shadcn-style UI** (Card, Button, Progress), **Framer Motion**, **Lucide React**, **Recharts**
- **OpenAI** (gpt-4o-mini) for CV analysis and mock interview
- **pdf-parse** for PDF text extraction

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set your OpenAI API key:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add:

   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Features

- **Job selector**: Choose one of 6 featured internships (Red Bull, L'Oréal, Google, Deloitte, Amazon, Microsoft) before uploading your CV.
- **Upload PDF** or **paste your CV text** for analysis (job-specific).
- **Employability score** (0–100) with radial display.
- **Gateway Certified** badge (when score > 80) with copy-link to share.
- **Recruiter's roast** (witty, Gen-Z style one-liner).
- **Skill radar**: Recharts radar chart comparing your CV to job requirements.
- **Strengths** and **Critical fixes** (job-specific; never “full-time experience”—focus on academic/soft skills).
- **Magic fix**: 3 improved bullet points for the selected role.
- **Boost your Experience**: AI-suggested professional bullets from hobbies/school projects.
- **Pro Referral**: 2 company matches with **Unlock Pro Access**; click-to-copy subject line and 3-step outreach (Hook, Value, CTA).
- **Mock Interview**: 3 tailored questions and performance feedback for the selected job.

## Responsive design

Optimized for mobile and tablet (e.g. sales conference demos): touch-friendly buttons (min 44px), single-column stacking on small screens, no horizontal scroll.

## License

Private / educational use.
