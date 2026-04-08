import { useState } from 'react';
import { motion } from 'framer-motion';
import { defaultSubjects, Subject } from '@/data/subjects';
import { Plus, X } from 'lucide-react';

interface SubjectSelectorProps {
  activeSubject: string | null;
  onSelect: (name: string | null) => void;
}

const SubjectSelector = ({ activeSubject, onSelect }: SubjectSelectorProps) => {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [filter, setFilter] = useState<'all' | 'electronics' | 'telecom' | 'core'>('all');

  const filtered = filter === 'all' ? subjects : subjects.filter(s => s.category === filter);

  const addSubject = () => {
    if (!newName.trim()) return;
    const sub: Subject = { id: Date.now().toString(), name: newName.trim(), icon: '📘', category: 'core' };
    setSubjects([...subjects, sub]);
    setNewName('');
    setAdding(false);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    if (subjects.find(s => s.id === id)?.name === activeSubject) onSelect(null);
  };

  const filters: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'electronics', label: 'ECE' },
    { key: 'telecom', label: 'Telecom' },
    { key: 'core', label: 'Core' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Subjects</h3>
        <button onClick={() => setAdding(!adding)} className="text-muted-foreground hover:text-primary transition-colors">
          {adding ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded transition-colors ${filter === f.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Add input */}
      {adding && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex gap-2">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSubject()}
            placeholder="Subject name..."
            className="flex-1 bg-secondary text-foreground text-sm px-3 py-1.5 rounded-lg border-none outline-none placeholder:text-muted-foreground font-mono"
            autoFocus
          />
          <button onClick={addSubject} className="text-xs font-mono bg-primary text-primary-foreground px-3 rounded-lg">Go</button>
        </motion.div>
      )}

      {/* Subject grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
        {filtered.map(sub => (
          <motion.button
            key={sub.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(activeSubject === sub.name ? null : sub.name)}
            className={`group relative text-left p-3 rounded-lg transition-all text-sm ${
              activeSubject === sub.name
                ? 'bg-primary/10 border-glow glow-amber'
                : 'bg-secondary hover:bg-muted'
            }`}
          >
            <span className="text-base">{sub.icon}</span>
            <p className={`text-xs font-medium mt-1 leading-tight ${activeSubject === sub.name ? 'text-primary' : 'text-foreground'}`}>
              {sub.name}
            </p>
            {!defaultSubjects.find(d => d.id === sub.id) && (
              <button
                onClick={e => { e.stopPropagation(); removeSubject(sub.id); }}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
              >
                <X size={10} />
              </button>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
