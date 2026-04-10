import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import type { FocusTask } from '@/components/SubjectSelector';

interface FocusTimerProps {
  activeTask: FocusTask | null;
}

const BREAK_TIME = 5 * 60;

const FocusTimer = ({ activeTask }: FocusTimerProps) => {
  const focusTime = (activeTask?.minutes ?? 25) * 60;
  const [timeLeft, setTimeLeft] = useState(focusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessions] = useState(0);
  const [targetTimeMs, setTargetTimeMs] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalTime = isBreak ? BREAK_TIME : focusTime;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const reset = useCallback(() => {
    setIsRunning(false);
    setTargetTimeMs(null);
    setIsBreak(false);
    setTimeLeft(focusTime);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [focusTime]);

  const toggleBreak = useCallback(() => {
    setIsRunning(false);
    setTargetTimeMs(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(focusTime);
    } else {
      setIsBreak(true);
      setTimeLeft(BREAK_TIME);
    }
  }, [focusTime, isBreak]);

  useEffect(() => {
    setIsRunning(false);
    setTargetTimeMs(null);
    setIsBreak(false);
    setTimeLeft(focusTime);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [focusTime]);

  useEffect(() => {
    if (isRunning && targetTimeMs !== null) {
      const syncWithClock = () => {
        const next = Math.max(0, Math.ceil((targetTimeMs - Date.now()) / 1000));
        setTimeLeft(prev => {
          if (prev === 0) return 0;
          if (next === 0) {
            setIsRunning(false);
            setTargetTimeMs(null);
            if (!isBreak) {
              setSessions(s => s + 1);
            }
            return 0;
          }
          return prev === next ? prev : next;
        });
      };

      syncWithClock();
      intervalRef.current = setInterval(syncWithClock, 250);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isBreak, targetTimeMs]);

  const toggleRunning = useCallback(() => {
    if (isRunning) {
      if (targetTimeMs !== null) {
        const remaining = Math.max(0, Math.ceil((targetTimeMs - Date.now()) / 1000));
        setTimeLeft(remaining);
      }
      setIsRunning(false);
      setTargetTimeMs(null);
      return;
    }

    if (timeLeft <= 0) return;

    setTargetTimeMs(Date.now() + timeLeft * 1000);
    setIsRunning(true);
  }, [isRunning, targetTimeMs, timeLeft]);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-6">
      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-primary animate-pulse-glow' : 'bg-muted-foreground'}`} />
        <span className="text-xs font-display uppercase tracking-[0.2em] text-muted-foreground">
          {isBreak ? 'Break time' : isRunning ? 'Locked in' : 'Ready'}
        </span>
      </div>

      {/* Timer circle */}
      <div className="relative w-44 h-44 sm:w-52 sm:h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
          <motion.circle
            cx="100" cy="100" r="90" fill="none"
            stroke={isBreak ? "hsl(var(--teal-accent))" : "hsl(var(--primary))"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={timeLeft}
            className="text-3xl sm:text-4xl font-display font-light text-foreground glow-amber-text"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
          >
            {formatTime(timeLeft)}
          </motion.span>
          {activeTask && (
            <span className="text-[10px] font-display uppercase tracking-[0.15em] text-muted-foreground mt-2 max-w-[120px] text-center truncate">
              {activeTask.title}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={reset} className="p-2 sm:p-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-colors">
          <RotateCcw size={16} />
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleRunning}
          className="p-3 sm:p-4 rounded-xl bg-primary text-primary-foreground glow-amber transition-all hover:opacity-90"
        >
          {isRunning ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </motion.button>
        <button onClick={toggleBreak} className={`p-2 sm:p-2.5 rounded-lg transition-colors ${isBreak ? 'bg-accent text-accent-foreground glow-teal' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
          <Coffee size={16} />
        </button>
      </div>

      {/* Sessions */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {Array.from({ length: Math.min(sessionsCompleted, 8) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
        {Array.from({ length: Math.max(0, 8 - sessionsCompleted) }).map((_, i) => (
          <div key={`e-${i}`} className="w-2 h-2 rounded-full bg-secondary" />
        ))}
        <span className="text-[10px] font-display text-muted-foreground ml-2">{sessionsCompleted} done</span>
      </div>
    </div>
  );
};

export default FocusTimer;
