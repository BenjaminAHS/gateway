"use client";

import { motion } from "framer-motion";

export function ProcessingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <p className="text-lg sm:text-xl text-zinc-300 mb-6">
        Analyzing your potential...
      </p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-violet-500"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <motion.div
        className="mt-8 h-1 w-48 sm:w-64 rounded-full bg-zinc-800 overflow-hidden"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full bg-violet-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "70%" }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.div>
    </motion.div>
  );
}
