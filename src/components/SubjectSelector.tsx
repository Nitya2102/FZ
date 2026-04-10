import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, X } from 'lucide-react';
import type { FocusTask } from '@/lib/focus-task';
import { isFirebaseConfigured } from '@/lib/firebase';
import { createTodo, ensureSignedInUser, softDeleteTodo, subscribeTodos, toggleTodoDone } from '@/lib/todo-store';

export type { FocusTask } from '@/lib/focus-task';

interface SubjectSelectorProps {
  activeTaskId: string | null;
  onSelect: (task: FocusTask | null) => void;
}

const SubjectSelector = ({ activeTaskId, onSelect }: SubjectSelectorProps) => {
  const [tasks, setTasks] = useState<FocusTask[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newMinutes, setNewMinutes] = useState('25');
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let unsub: (() => void) | null = null;
    let cancelled = false;

    ensureSignedInUser()
      .then((resolvedUid) => {
        if (cancelled) return;
        setUid(resolvedUid);
        unsub = subscribeTodos(
          resolvedUid,
          setTasks,
          (error) => console.error('Failed to subscribe todos:', error),
        );
      })
      .catch((error) => {
        console.error('Failed to initialize Firebase todos:', error);
      });

    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, []);

  const createTask = async () => {
    const title = newTitle.trim();
    const parsedMinutes = Number(newMinutes);
    const minutes = Number.isFinite(parsedMinutes) ? Math.max(1, Math.min(240, Math.floor(parsedMinutes))) : 25;

    if (!title) return;

    if (uid) {
      try {
        await createTodo(uid, title, minutes);
      } catch (error) {
        console.error('Failed to create todo:', error);
      }
    } else {
      const task: FocusTask = {
        id: Date.now().toString(),
        title,
        minutes,
        done: false,
      };

      setTasks(prev => [task, ...prev]);
    }

    setNewTitle('');
    setNewMinutes('25');
  };

  const removeTask = async (task: FocusTask) => {
    if (uid) {
      try {
        await softDeleteTodo(uid, task);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    } else {
      setTasks(prev => prev.filter((item) => item.id !== task.id));
    }

    if (task.id === activeTaskId) onSelect(null);
  };

  const toggleDone = async (task: FocusTask) => {
    if (uid) {
      try {
        await toggleTodoDone(uid, task);
      } catch (error) {
        console.error('Failed to toggle todo:', error);
      }
      return;
    }

    setTasks(prev => prev.map(item => (item.id === task.id ? { ...item, done: !item.done } : item)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[11px] font-display uppercase tracking-[0.2em] text-muted-foreground">Focus Tasks</h3>
        <span className="text-[10px] font-display uppercase tracking-[0.15em] text-muted-foreground">Enter and pick one</span>
      </div>

      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[1fr_88px_auto]">
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createTask()}
          placeholder="Add a task (todo)"
          className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border-none outline-none placeholder:text-muted-foreground"
        />
        <div className="grid grid-cols-[1fr_auto] gap-2 sm:contents">
          <input
            type="number"
            min={1}
            max={240}
            value={newMinutes}
            onChange={e => setNewMinutes(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createTask()}
            className="bg-secondary text-foreground text-sm px-3 py-2 rounded-lg border-none outline-none"
          />
          <button onClick={createTask} className="h-full px-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center">
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No tasks yet. Add one and set minutes to focus.
          </div>
        )}

        {tasks.map(task => (
          <motion.button
            key={task.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(activeTaskId === task.id ? null : task)}
            className={`group relative w-full text-left p-3 rounded-xl transition-all ${
              activeTaskId === task.id
                ? 'bg-primary/10 border-glow glow-amber'
                : 'bg-secondary/60 hover:bg-secondary'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className={`text-xs font-medium truncate ${activeTaskId === task.id ? 'text-primary' : 'text-foreground'} ${task.done ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </p>
                <p className="text-[10px] mt-1 font-display uppercase tracking-[0.15em] text-muted-foreground">
                  {task.minutes} min focus
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={e => { e.stopPropagation(); void toggleDone(task); }}
                  className={`p-1.5 rounded-md transition-colors ${task.done ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  title={task.done ? 'Mark not done' : 'Mark done'}
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); void removeTask(task); }}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;
