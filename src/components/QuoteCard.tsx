import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quotes, Quote } from '@/data/quotes';
import { RefreshCw } from 'lucide-react';

const sourceIcons: Record<string, string> = {
  naruto: '🍥',
  deathnote: '📓',
  chess: '♟️',
};

const sourceLabels: Record<string, string> = {
  naruto: 'Naruto',
  deathnote: 'Death Note',
  chess: 'Chess',
};

const QuoteCard = () => {
  const [quote, setQuote] = useState<Quote>(quotes[0]);
  const [key, setKey] = useState(0);

  const shuffle = () => {
    let next: Quote;
    do { next = quotes[Math.floor(Math.random() * quotes.length)]; } while (next.text === quote.text && quotes.length > 1);
    setQuote(next);
    setKey(k => k + 1);
  };

  useEffect(() => { shuffle(); }, []);

  // Auto-rotate every 30s
  useEffect(() => {
    const timer = setInterval(shuffle, 30000);
    return () => clearInterval(timer);
  }, [quote]);

  return (
    <div className="relative p-4 sm:p-5 rounded-xl bg-secondary/50 border-glow overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 text-6xl opacity-[0.04] select-none pointer-events-none">
        {sourceIcons[quote.source]}
      </div>

      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm">{sourceIcons[quote.source]}</span>
          <span className="text-[10px] font-display uppercase tracking-[0.15em] text-muted-foreground">
            {sourceLabels[quote.source]}
          </span>
        </div>
        <button onClick={shuffle} className="text-muted-foreground hover:text-primary transition-colors">
          <RefreshCw size={12} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
            "{quote.text}"
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-display">
            — {quote.author}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuoteCard;
