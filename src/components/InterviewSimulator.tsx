"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, X } from "lucide-react";
import type { FeaturedJob } from "@/lib/types";
import type { AnalysisResult } from "@/lib/types";

interface InterviewSimulatorProps {
  selectedJob: FeaturedJob | null;
  analysis: AnalysisResult;
  onClose: () => void;
}

type Phase = "idle" | "loading_questions" | "answering" | "loading_feedback" | "feedback";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function InterviewSimulator({ selectedJob, analysis, onClose }: InterviewSimulatorProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const jobLabel = selectedJob ? (selectedJob.role ? `${selectedJob.name} – ${selectedJob.role}` : selectedJob.name) : "this role";
  const cvSummary = [analysis.roast, analysis.strengths.join(" "), analysis.magic_fix.join(" ")].join(" ");

  const fetchQuestions = useCallback(async () => {
    setPhase("loading_questions");
    try {
      const res = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobLabel, cvSummary: cvSummary.slice(0, 2000), action: "questions" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load questions");
      const qs = data.questions ?? [];
      setQuestions(qs);
      setMessages(qs.map((q: string) => ({ role: "assistant" as const, content: q })));
      setPhase("answering");
    } catch {
      setPhase("idle");
    }
  }, [jobLabel, cvSummary]);

  const submitAnswer = useCallback(() => {
    if (!currentAnswer.trim() || answers.length >= 3) return;
    const newAnswers = [...answers, currentAnswer.trim()];
    setAnswers(newAnswers);
    setMessages((m) => [...m, { role: "user" as const, content: currentAnswer.trim() }]);
    setCurrentAnswer("");
    if (newAnswers.length === 3) {
      setPhase("loading_feedback");
      fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobLabel, cvSummary, action: "feedback", answers: newAnswers }),
      })
        .then((r) => r.json())
        .then((data) => {
          setFeedback(data.feedback ?? "No feedback generated.");
          setPhase("feedback");
        })
        .catch(() => setPhase("answering"));
    }
  }, [currentAnswer, answers, jobLabel, cvSummary]);

  const currentQuestionIndex = answers.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg max-h-[85vh] flex flex-col rounded-xl border border-white/10 bg-zinc-900 shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-violet-400" />
            Mock Interview – {jobLabel}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <p className="text-zinc-400 text-sm mb-6">
                  Practice with 3 tailored questions. The AI will act as the recruiter and give you performance feedback at the end.
                </p>
                <Button onClick={fetchQuestions} className="gap-2 min-h-[44px]">
                  Start Mock Interview
                </Button>
              </motion.div>
            )}
            {phase === "loading_questions" && (
              <motion.p key="loadingq" className="text-zinc-500 text-center py-8">
                Preparing your questions...
              </motion.p>
            )}
            {phase === "answering" && (
              <motion.div
                key="answering"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={msg.role === "assistant" ? "flex justify-start" : "flex justify-end"}
                  >
                    <div
                      className={
                        msg.role === "assistant"
                          ? "max-w-[85%] rounded-lg bg-zinc-800 px-4 py-2 text-zinc-200 text-sm"
                          : "max-w-[85%] rounded-lg bg-violet-500/20 px-4 py-2 text-zinc-200 text-sm"
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {currentQuestionIndex < 3 && (
                  <div className="pt-2">
                    <p className="text-xs text-zinc-500 mb-2">
                      Question {currentQuestionIndex + 1} of 3
                    </p>
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="w-full min-h-[100px] rounded-lg bg-zinc-800 border border-white/10 px-4 py-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-y"
                    />
                    <Button
                      onClick={submitAnswer}
                      disabled={!currentAnswer.trim()}
                      className="mt-2 gap-2 w-full sm:w-auto min-h-[44px]"
                    >
                      <Send className="w-4 h-4" />
                      Submit &amp; Continue
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
            {phase === "loading_feedback" && (
              <motion.p key="loadingf" className="text-zinc-500 text-center py-8">
                Generating your performance feedback...
              </motion.p>
            )}
            {phase === "feedback" && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <Card className="border-violet-500/20 bg-violet-500/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-violet-400 mb-2">Performance Feedback</h4>
                    <p className="text-zinc-300 text-sm whitespace-pre-wrap">{feedback}</p>
                  </CardContent>
                </Card>
                <Button onClick={onClose} variant="outline" className="w-full min-h-[44px]">
                  Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
