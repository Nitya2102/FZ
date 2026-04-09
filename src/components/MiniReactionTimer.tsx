import { useEffect, useRef, useState } from 'react';

type GameState = 'idle' | 'waiting' | 'ready' | 'result';

type GameColor = {
  name: string;
  buttonClass: string;
  panelClass: string;
};

const COLORS: GameColor[] = [
  {
    name: 'Red',
    buttonClass: 'bg-red-300/35 hover:bg-red-300/50 border border-red-200/45',
    panelClass: 'bg-red-500/30 border-red-300/60',
  },
  {
    name: 'Blue',
    buttonClass: 'bg-sky-300/35 hover:bg-sky-300/50 border border-sky-200/45',
    panelClass: 'bg-blue-500/30 border-blue-300/60',
  },
  {
    name: 'Green',
    buttonClass: 'bg-emerald-300/35 hover:bg-emerald-300/50 border border-emerald-200/45',
    panelClass: 'bg-emerald-500/30 border-emerald-300/60',
  },
  {
    name: 'Yellow',
    buttonClass: 'bg-amber-200/40 hover:bg-amber-200/55 border border-amber-100/45',
    panelClass: 'bg-amber-500/28 border-amber-200/60',
  },
];

const ROUND_SECONDS = 60;

const pickRandomIndex = (exclude?: number) => {
  if (COLORS.length <= 1) return 0;
  let idx = Math.floor(Math.random() * COLORS.length);
  while (idx === exclude) {
    idx = Math.floor(Math.random() * COLORS.length);
  }
  return idx;
};

const MiniReactionTimer = () => {
  const [state, setState] = useState<GameState>('idle');
  const [message, setMessage] = useState('Press start, then click the color named in the text.');
  const [lastTimeMs, setLastTimeMs] = useState<number | null>(null);
  const [bestTimeMs, setBestTimeMs] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [roundActive, setRoundActive] = useState(false);
  const [targetColorIndex, setTargetColorIndex] = useState<number | null>(null);
  const [panelColorIndex, setPanelColorIndex] = useState<number | null>(null);

  const startRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundTickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (roundTickerRef.current) {
        clearInterval(roundTickerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!roundActive || secondsLeft > 0) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (roundTickerRef.current) {
      clearInterval(roundTickerRef.current);
      roundTickerRef.current = null;
    }

    setRoundActive(false);
    setState('result');
    setTargetColorIndex(null);
    setPanelColorIndex(null);
    setMessage('Time up');
  }, [roundActive, secondsLeft]);

  const queuePrompt = () => {
    setState('waiting');
    setTargetColorIndex(null);
    setPanelColorIndex(null);
    setMessage('...');

    const delay = 500 + Math.floor(Math.random() * 1300);
    timeoutRef.current = setTimeout(() => {
      const nextTarget = pickRandomIndex();
      const nextPanel = pickRandomIndex(nextTarget);

      startRef.current = performance.now();
      setTargetColorIndex(nextTarget);
      setPanelColorIndex(nextPanel);
      setState('ready');
      setMessage(`Click ${COLORS[nextTarget].name}`);
      timeoutRef.current = null;
    }, delay);
  };

  const resetRound = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (roundTickerRef.current) {
      clearInterval(roundTickerRef.current);
      roundTickerRef.current = null;
    }
    startRef.current = null;
    setRoundActive(false);
    setSecondsLeft(ROUND_SECONDS);
    setScore(0);
    setMistakes(0);
    setState('idle');
    setTargetColorIndex(null);
    setPanelColorIndex(null);
    setMessage('Tap start');
    setLastTimeMs(null);
  };

  const startRound = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (roundTickerRef.current) {
      clearInterval(roundTickerRef.current);
      roundTickerRef.current = null;
    }

    setRoundActive(true);
    setSecondsLeft(ROUND_SECONDS);
    setScore(0);
    setMistakes(0);
    setLastTimeMs(null);
    setState('waiting');

    roundTickerRef.current = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    queuePrompt();
  };

  const handleColorClick = (clickedIndex: number) => {
    if (!roundActive || secondsLeft <= 0) {
      return;
    }

    if (state === 'waiting') {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setMistakes((prev) => prev + 1);
      setMessage('Too soon');
      queuePrompt();
      return;
    }

    if (state !== 'ready' || startRef.current === null || targetColorIndex === null) {
      return;
    }

    if (clickedIndex !== targetColorIndex) {
      setMistakes((prev) => prev + 1);
      setLastTimeMs(null);
      setMessage(`Miss (${COLORS[targetColorIndex].name})`);
      queuePrompt();
      return;
    }

    const elapsed = Math.round(performance.now() - startRef.current);
    setLastTimeMs(elapsed);
    setBestTimeMs((best) => (best === null ? elapsed : Math.min(best, elapsed)));
    setScore((prev) => prev + 1);
    setMessage('Nice');
    queuePrompt();
  };

  const panelClasses =
    state === 'ready' && panelColorIndex !== null
      ? COLORS[panelColorIndex].panelClass
        : state === 'waiting'
          ? 'bg-secondary/60 border-border'
          : 'bg-secondary/55 border-border';

  const pace = Math.round((score / ROUND_SECONDS) * 60);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-display uppercase tracking-[0.15em] text-foreground">Reaction Timer</h3>
          <p className="text-[10px] text-muted-foreground">Match the word, not the background.</p>
        </div>
        <div className="rounded-md border border-border bg-secondary/35 px-2 py-1 text-[11px] text-foreground tabular-nums">
          {secondsLeft}s
        </div>
      </div>

      <div className={`w-full rounded-xl border p-4 sm:p-5 text-center transition-colors ${panelClasses}`}>
        <p className="text-xs sm:text-sm font-display uppercase tracking-[0.12em] text-foreground">{message}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {COLORS.map((color, idx) => (
          <button
            key={color.name}
            type="button"
            onClick={() => handleColorClick(idx)}
            className={`rounded-md px-3 py-2 text-[11px] font-display uppercase tracking-[0.12em] text-foreground transition-colors ${color.buttonClass}`}
          >
            {color.name}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        <div className="rounded-lg border border-border bg-secondary/35 px-2 py-1.5 text-muted-foreground">
          Correct: <span className="text-foreground">{score}</span>
        </div>
        <div className="rounded-lg border border-border bg-secondary/35 px-2 py-1.5 text-muted-foreground">
          Miss: <span className="text-foreground">{mistakes}</span>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 px-2 py-1.5 text-muted-foreground">
          Last: <span className="text-foreground">{lastTimeMs === null ? '--' : `${lastTimeMs} ms`}</span>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 px-2 py-1.5 text-muted-foreground">
          Pace: <span className="text-foreground">{pace}/min</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={startRound}
          className="rounded-md bg-primary px-3 py-1.5 text-[11px] font-display uppercase tracking-[0.12em] text-primary-foreground disabled:opacity-50"
          disabled={roundActive}
        >
          Start
        </button>
        <button
          type="button"
          onClick={resetRound}
          className="rounded-md border border-border px-3 py-1.5 text-[11px] font-display uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
        >
          Reset
        </button>
        {bestTimeMs !== null ? (
          <span className="text-[11px] text-muted-foreground ml-auto">Best {bestTimeMs} ms</span>
        ) : null}
      </div>
    </div>
  );
};

export default MiniReactionTimer;
