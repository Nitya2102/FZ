import { useState } from 'react';
import { motion } from 'framer-motion';
import FocusTimer from '@/components/FocusTimer';
import SubjectSelector from '@/components/SubjectSelector';
import QuoteCard from '@/components/QuoteCard';
import kakashiImg from '@/assets/kakashi.png';
import chessPawnImg from '@/assets/chess-pawn.png';

const Index = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle circuit grid */}
      <div className="fixed inset-0 circuit-pattern opacity-30 pointer-events-none" />

      {/* Kakashi — prominent, bottom right */}
      <motion.img
        src={kakashiImg}
        alt=""
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.25, y: 0 }}
        transition={{ delay: 0.4, duration: 1.2 }}
        className="fixed bottom-0 right-0 w-80 lg:w-[28rem] pointer-events-none select-none"
      />

      {/* Chess pawn — top left accent */}
      <motion.img
        src={chessPawnImg}
        alt=""
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 0.15, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="fixed top-12 left-10 w-20 lg:w-28 pointer-events-none select-none -rotate-6"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Minimal top bar */}
        <div className="flex items-center justify-between mb-12">
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
          className="text-center mb-14"
        >
          <h1 className="text-4xl sm:text-5xl font-display font-light text-foreground tracking-tight">
            Lock <span className="text-primary glow-amber-text font-medium">In</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-3 font-light tracking-wide">
            No shortcuts. Just execution.
          </p>
        </motion.div>

        {/* Two column: Timer + Subjects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border"
          >
            <FocusTimer activeSubject={activeSubject} />
          </motion.div>

          {/* Subjects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border"
          >
            <SubjectSelector activeSubject={activeSubject} onSelect={setActiveSubject} />
          </motion.div>
        </div>

        {/* Quote + Status row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-3"
          >
            <QuoteCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card/60 backdrop-blur-sm rounded-2xl p-5 border border-border"
          >
            <h3 className="text-[11px] font-display uppercase tracking-[0.2em] text-muted-foreground mb-4">System</h3>
            <div className="space-y-2.5">
              <StatusLine label="Focus" value="Online" />
              <StatusLine label="Distractions" value="Blocked" />
              <StatusLine label="Excuses" value="404" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());
  useState(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  });
  return (
    <span className="text-[11px] font-display text-muted-foreground tabular-nums tracking-wider">
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </span>
  );
};

const StatusLine = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-[12px]">
    <span className="text-muted-foreground font-light">{label}</span>
    <span className="text-accent font-display tracking-wider">{value}</span>
  </div>
);

export default Index;
