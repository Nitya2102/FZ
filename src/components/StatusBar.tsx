import { useState, useEffect } from 'react';
import { Zap, Crown, Cpu } from 'lucide-react';

const StatusBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 6) return 'Night owl mode';
    if (h < 12) return 'Morning grind';
    if (h < 17) return 'Afternoon focus';
    if (h < 21) return 'Evening session';
    return 'Late night arc';
  };

  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <Cpu size={12} className="text-accent" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Study Terminal</span>
        </div>
        <div className="w-px h-3 bg-border" />
        <span className="text-[10px] font-mono text-muted-foreground">{greeting()}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Crown size={10} className="text-primary" />
          <span className="text-[10px] font-mono text-primary">King's Gambit</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums">
          {time.toLocaleTimeString('en-US', { hour12: false })}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
