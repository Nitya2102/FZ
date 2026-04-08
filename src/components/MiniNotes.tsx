import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, X } from 'lucide-react';

const MiniNotes = () => {
  const [notes, setNotes] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const add = () => {
    if (!input.trim()) return;
    setNotes([input.trim(), ...notes]);
    setInput('');
  };

  return (
    <div className="space-y-3">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-xs font-display uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors w-full">
        <FileText size={12} />
        <span>Quick Notes</span>
        <span className="ml-auto text-[10px] bg-secondary px-1.5 py-0.5 rounded">{notes.length}</span>
      </button>

      {open && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-2">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()}
              placeholder="Quick thought..."
              className="flex-1 bg-secondary text-foreground text-xs px-3 py-1.5 rounded-lg outline-none placeholder:text-muted-foreground font-display"
            />
            <button onClick={add} className="text-muted-foreground hover:text-primary"><Plus size={14} /></button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {notes.map((n, i) => (
              <div key={i} className="flex items-start justify-between gap-2 text-xs text-secondary-foreground bg-secondary/50 px-3 py-2 rounded-lg group">
                <span>{n}</span>
                <button onClick={() => setNotes(notes.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive shrink-0 mt-0.5">
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MiniNotes;
