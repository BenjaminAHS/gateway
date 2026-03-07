import { Award } from "lucide-react";

interface CertifiedPageProps {
  searchParams: Promise<{ job?: string; score?: string }>;
}

export default async function CertifiedPage({ searchParams }: CertifiedPageProps) {
  const params = await searchParams;
  const job = typeof params.job === "string" ? decodeURIComponent(params.job) : "";
  const score = typeof params.score === "string" ? params.score : "";

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 flex items-center justify-center p-4">
      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
          <Award className="w-10 h-10 text-violet-400" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">Gateway Certified</h1>
        {job && (
          <p className="text-zinc-400 mt-2">Ready for {job}</p>
        )}
        {score && (
          <p className="text-violet-400 font-semibold mt-1">Score: {score}</p>
        )}
        <p className="text-zinc-500 text-sm mt-4">GATEWAY – Land Your First Internship</p>
      </div>
    </div>
  );
}
