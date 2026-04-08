import { useState } from 'react';
import { motion } from 'framer-motion';
import FocusTimer from '@/components/FocusTimer';
import SubjectSelector from '@/components/SubjectSelector';
import QuoteCard from '@/components/QuoteCard';
import StatusBar from '@/components/StatusBar';
import MiniNotes from '@/components/MiniNotes';

const Index = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background circuit-pattern">
      <div className="min-h-screen bg-background/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <StatusBar />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-8 pb-10"
          >
            <h1 className="text-2xl sm:text-3xl font-mono font-light text-foreground tracking-tight">
              Lock <span className="text-primary glow-amber-text">In</span>
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-2 tracking-[0.15em] uppercase">
              Execute the plan. No distractions.
            </p>
          </motion.div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
            {/* Left panel - Subjects */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-4 space-y-6"
            >
              <div className="bg-card rounded-xl p-5 border border-border">
                <SubjectSelector activeSubject={activeSubject} onSelect={setActiveSubject} />
              </div>
              <div className="bg-card rounded-xl p-5 border border-border">
                <MiniNotes />
              </div>
            </motion.div>

            {/* Center - Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 flex flex-col items-center"
            >
              <div className="bg-card rounded-xl p-8 border border-border w-full">
                <FocusTimer activeSubject={activeSubject} />
              </div>

              {/* Motivational strip */}
              <div className="mt-6 w-full">
                <QuoteCard />
              </div>
            </motion.div>

            {/* Right panel - Stats & vibes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-4 space-y-4"
            >
              {/* Today's mission */}
              <div className="bg-card rounded-xl p-5 border border-border">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">Today's Protocol</h3>
                <div className="space-y-3">
                  <ProtocolItem emoji="♟️" text="Think 3 moves ahead" />
                  <ProtocolItem emoji="📓" text="Write the name of the topic. Master it." />
                  <ProtocolItem emoji="🍥" text="Never give up. That's your ninja way." />
                  <ProtocolItem emoji="⚡" text="Circuits don't lie. Solve until clean." />
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Mode" value="Deep Work" icon="🎯" />
                <StatCard label="Style" value="Strategic" icon="♛" />
              </div>

              {/* Circuit element */}
              <div className="bg-card rounded-xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">System Status</span>
                </div>
                <div className="space-y-2">
                  <StatusLine label="Focus" value="Online" ok />
                  <StatusLine label="Distractions" value="Blocked" ok />
                  <StatusLine label="Brain" value="Overclocked" ok />
                  <StatusLine label="Excuses" value="404 Not Found" ok />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtocolItem = ({ emoji, text }: { emoji: string; text: string }) => (
  <div className="flex items-start gap-3">
    <span className="text-sm mt-0.5">{emoji}</span>
    <p className="text-xs text-secondary-foreground leading-relaxed">{text}</p>
  </div>
);

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="bg-card rounded-xl p-4 border border-border text-center">
    <span className="text-lg">{icon}</span>
    <p className="text-xs font-mono text-primary mt-1">{value}</p>
    <p className="text-[10px] text-muted-foreground font-mono uppercase">{label}</p>
  </div>
);

const StatusLine = ({ label, value, ok }: { label: string; value: string; ok: boolean }) => (
  <div className="flex items-center justify-between text-[11px] font-mono">
    <span className="text-muted-foreground">{label}</span>
    <span className={ok ? 'text-accent' : 'text-destructive'}>{value}</span>
  </div>
);

export default Index;
