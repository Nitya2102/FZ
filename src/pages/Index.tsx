import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import FocusTimer from '@/components/FocusTimer';
import SubjectSelector from '@/components/SubjectSelector';
import type { FocusTask } from '@/components/SubjectSelector';
import QuoteCard from '@/components/QuoteCard';
import JumbledQuote from '@/components/JumbledQuote';
import kakashiImg from '@/assets/kakashi.png';

const Index = () => {
  const [activeTask, setActiveTask] = useState<FocusTask | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle circuit grid */}
      <div className="fixed inset-0 circuit-pattern opacity-30 pointer-events-none" />

      {/* Soft background Kakashi */}
      <motion.img
        src={kakashiImg}
        alt=""
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.25, y: 0 }}
        transition={{ delay: 0.4, duration: 1.2 }}
        className="fixed bottom-0 right-0 w-44 sm:w-72 lg:w-[28rem] pointer-events-none select-none"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Minimal top bar */}
        <div className="flex items-center justify-between mb-8 sm:mb-12 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-[11px] font-display uppercase tracking-[0.25em] text-muted-foreground">Online</span>
          </div>
          <TimeDisplay />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-14"
        >
          <img
            src={kakashiImg}
            alt="Kakashi"
            className="mx-auto mb-4 sm:mb-5 w-24 sm:w-32 md:w-36 drop-shadow-[0_0_28px_rgba(245,158,11,0.35)]"
          />
          <h1 className="text-3xl sm:text-5xl font-display font-light text-foreground tracking-tight">
            Lock <span className="text-primary glow-amber-text font-medium">In</span>
          </h1>
          <JumbledQuote />
        </motion.div>

        {/* Two column: Timer + Subjects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 mb-8 sm:mb-10">
          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 sm:p-8 border border-border"
          >
            <FocusTimer activeTask={activeTask} />
          </motion.div>

          {/* Subjects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-border"
          >
            <SubjectSelector activeTaskId={activeTask?.id ?? null} onSelect={setActiveTask} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full"
          >
            <QuoteCard />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="text-[11px] font-display text-muted-foreground tabular-nums tracking-wider">
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </span>
  );
};

export default Index;
