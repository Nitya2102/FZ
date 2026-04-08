import { useMemo, useState } from 'react';
import { Reorder } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface QuoteWord {
  id: string;
  text: string;
}

const quotePool = [
  ['Small', 'steps,', 'big', 'wins,', 'snacks', 'in', 'between.'],
  ['Study', 'now,', 'panic', 'never,', 'snack', 'wisely.'],
  ['One', 'chapter', 'a', 'day', 'keeps', 'the', 'cram', 'away.'],
  ['Highlighter', 'ready,', 'brain', 'loading,', 'chaos', 'pending.'],
  ['Notes', 'first,', 'scrolling', 'later,', 'victory', 'always.'],
];

const shuffle = (words: QuoteWord[]) => {
  const arr = [...words];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const JumbledQuote = () => {
  const pickRandomQuote = (excludeIndex?: number) => {
    if (quotePool.length <= 1) return 0;

    let idx = Math.floor(Math.random() * quotePool.length);
    while (idx === excludeIndex) {
      idx = Math.floor(Math.random() * quotePool.length);
    }
    return idx;
  };

  const [quoteIndex, setQuoteIndex] = useState(() => pickRandomQuote());
  const quoteWords = quotePool[quoteIndex];

  const baseWords = useMemo(
    () => quoteWords.map((word, idx) => ({ id: `${idx}-${word}-${quoteIndex}`, text: word })),
    [quoteIndex, quoteWords],
  );

  const [words, setWords] = useState<QuoteWord[]>(() => shuffle(baseWords));
  const [hasChecked, setHasChecked] = useState(false);

  const solved = words.every((word, idx) => word.text === quoteWords[idx]);
  const correctCount = words.reduce((count, word, idx) => {
    return count + (word.text === quoteWords[idx] ? 1 : 0);
  }, 0);

  const reshuffle = () => {
    const nextIndex = pickRandomQuote(quoteIndex);
    const nextQuoteWords = quotePool[nextIndex];
    const nextBaseWords = nextQuoteWords.map((word, idx) => ({
      id: `${idx}-${word}-${nextIndex}`,
      text: word,
    }));

    setQuoteIndex(nextIndex);
    setWords(shuffle(nextBaseWords));
    setHasChecked(false);
  };

  const handleCheck = () => {
    setHasChecked(true);
  };

  return (
    <div
      className={`mt-4 rounded-xl border bg-card/60 px-3 py-3 transition-colors ${
        !hasChecked
          ? 'border-border'
          : solved
            ? 'border-emerald-500/60 bg-emerald-500/10'
            : 'border-red-500/60 bg-red-500/10'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-display uppercase tracking-[0.16em] text-muted-foreground">
          Drag words to fix the quote
        </p>
        <button
          onClick={reshuffle}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:text-primary"
          title="Reshuffle"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      <Reorder.Group
        axis="x"
        values={words}
        onReorder={(next) => {
          setWords(next);
          setHasChecked(false);
        }}
        className="flex flex-wrap items-center justify-center gap-2"
      >
        {words.map((word) => (
          <Reorder.Item
            key={word.id}
            value={word}
            className={`cursor-grab rounded-lg border px-2.5 py-1 text-xs active:cursor-grabbing ${
              hasChecked
                ? word.text === quoteWords[words.findIndex(w => w.id === word.id)]
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-100'
                  : 'border-red-500/60 bg-red-500/15 text-red-100'
                : 'border-border bg-secondary text-foreground'
            }`}
            whileDrag={{ scale: 1.05 }}
          >
            {word.text}
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={handleCheck}
          className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-display uppercase tracking-[0.12em] text-primary-foreground"
        >
          Check
        </button>
        <button
          onClick={reshuffle}
          className="rounded-md border border-border px-2.5 py-1 text-[11px] font-display uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
        >
          Shuffle
        </button>
      </div>

      <div className="mt-2 flex items-center justify-center">
        <div
          className={`h-2 w-20 rounded-full transition-colors ${
            !hasChecked ? 'bg-muted' : solved ? 'bg-emerald-500' : 'bg-red-500'
          }`}
          title={!hasChecked ? 'Unchecked' : solved ? 'Correct' : 'Wrong'}
        />
      </div>
    </div>
  );
};

export default JumbledQuote;
