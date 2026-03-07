"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Unlock, Copy, Check } from "lucide-react";
import type { MatchWithOutreach } from "@/lib/types";

interface MatchmakerProps {
  matches: string[];
  matchesOutreach?: MatchWithOutreach[];
}

type SlotState = "locked" | "unlocked";

export function Matchmaker({ matches, matchesOutreach }: MatchmakerProps) {
  const [slot0, setSlot0] = useState<SlotState>("locked");
  const [slot1, setSlot1] = useState<SlotState>("locked");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleUnlock = useCallback((index: number) => {
    if (index === 0) setSlot0("unlocked");
    else setSlot1("unlocked");
  }, []);

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // ignore
    }
  }, []);

  const slots = [
    matchesOutreach?.[0] ?? { company: matches[0] ?? "Company", subject_line: "", hook: "", value: "", cta: "" },
    matchesOutreach?.[1] ?? { company: matches[1] ?? "Company", subject_line: "", hook: "", value: "", cta: "" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div>
        <h3 className="text-lg font-semibold text-zinc-200">Pro Referral</h3>
        <p className="text-zinc-500 text-sm mt-0.5">
          Recruiter introductions and outreach copy tailored to your profile.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {slots.map((slot, index) => {
          const state = index === 0 ? slot0 : slot1;
          return (
            <Card key={index} className="overflow-hidden border-white/10 bg-zinc-900/80">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-3 overflow-hidden">
                    <div className="w-full h-full bg-zinc-700 blur-md scale-150" aria-hidden />
                  </div>
                  <p className="font-medium text-zinc-200 text-sm sm:text-base">
                    {slot.company}
                  </p>
                  <div className="mt-3 w-full min-h-[44px]">
                    <AnimatePresence mode="wait">
                      {state === "locked" && (
                        <motion.div
                          key="locked"
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full"
                        >
                          <Button
                            onClick={() => handleUnlock(index)}
                            className="w-full gap-2"
                          >
                            <Unlock className="w-4 h-4" />
                            Unlock Pro Access
                          </Button>
                        </motion.div>
                      )}
                      {state === "unlocked" && (
                        <motion.div
                          key="unlocked"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-3 text-left"
                        >
                          {slot.subject_line ? (
                            <div>
                              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                                Subject line
                              </p>
                              <div className="flex items-center gap-2">
                                <code className="flex-1 text-zinc-300 text-xs sm:text-sm bg-zinc-800/80 px-2 py-1.5 rounded truncate">
                                  {slot.subject_line}
                                </code>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(slot.subject_line!, index * 10 + 1)}
                                  className="shrink-0 p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-violet-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                  aria-label="Copy subject line"
                                >
                                  {copiedIndex === index * 10 + 1 ? (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : null}
                          {(slot.hook || slot.value || slot.cta) && (
                            <div className="space-y-2 text-sm">
                              {slot.hook && (
                                <div>
                                  <p className="text-xs text-violet-400 font-medium">The Hook</p>
                                  <p className="text-zinc-300">{slot.hook}</p>
                                </div>
                              )}
                              {slot.value && (
                                <div>
                                  <p className="text-xs text-violet-400 font-medium">The Value</p>
                                  <p className="text-zinc-300">{slot.value}</p>
                                </div>
                              )}
                              {slot.cta && (
                                <div>
                                  <p className="text-xs text-violet-400 font-medium">The CTA</p>
                                  <p className="text-zinc-300">{slot.cta}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {!slot.subject_line && !slot.hook && !slot.value && !slot.cta && (
                            <p className="text-zinc-500 text-sm">Pro access unlocked. Outreach copy will appear when available.</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
