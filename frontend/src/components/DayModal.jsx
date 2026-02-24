import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Check, Loader2, StickyNote } from 'lucide-react';
import { entryAPI, taskAPI } from '../lib/api';
import { cn } from '../lib/utils';

const DayModal = ({ isOpen, onClose, tracker, day, year, month, entry, onUpdate }) => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const [notes, setNotes] = useState('');
    const [currentEntry, setCurrentEntry] = useState(entry);
    const [loading, setLoading] = useState(false);
    const [taskLoading, setTaskLoading] = useState(false);
    const taskInputRef = useRef(null);

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    useEffect(() => {
        if (isOpen) {
            setCurrentEntry(entry || null);
            setNotes(entry?.notes || '');
            setNewTaskTitle('');
            setNewTaskDesc('');
            if (entry?.id) {
                fetchTasks(entry.id);
            } else {
                setTasks([]);
            }
            // Auto-focus task input after a brief delay
            setTimeout(() => taskInputRef.current?.focus(), 100);
        }
    }, [isOpen, entry]);

    const fetchTasks = async (entryId) => {
        try {
            const response = await taskAPI.getForEntry(entryId);
            setTasks(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    // Returns the new entry — callers must use the returned value, NOT state
    const ensureEntry = async (targetStatus = 'empty') => {
        if (currentEntry) return currentEntry;
        try {
            const response = await entryAPI.upsert({
                tracker_id: tracker.id,
                entry_date: dateStr,
                status: targetStatus,
                notes: '',
            });
            const newEntry = response.data.data;
            setCurrentEntry(newEntry);
            onUpdate();
            return newEntry;
        } catch (error) {
            console.error('Failed to create entry:', error);
            return null;
        }
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;
        setTaskLoading(true);
        try {
            // Get (or create) the entry and use the returned value directly
            const entry = await ensureEntry();
            if (!entry) return;

            const response = await taskAPI.create({
                entry_id: entry.id,   // ← use local variable, NOT stale state
                title: newTaskTitle,
                description: newTaskDesc,
                completed: false,
            });
            setTasks((prev) => [...prev, response.data.data]);
            setNewTaskTitle('');
            setNewTaskDesc('');
            onUpdate();
            taskInputRef.current?.focus();
        } catch (error) {
            console.error('Failed to add task:', error);
        } finally {
            setTaskLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddTask();
        }
    };

    const handleToggleTask = async (task) => {
        try {
            await taskAPI.update(task.id, { completed: !task.completed });
            setTasks((prev) =>
                prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
            );
            onUpdate();
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskAPI.delete(taskId);
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            onUpdate();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleToggleDayStatus = async () => {
        setLoading(true);
        try {
            if (!currentEntry) {
                // First click: create entry AND mark as completed in one shot
                const response = await entryAPI.upsert({
                    tracker_id: tracker.id,
                    entry_date: dateStr,
                    status: 'completed',
                    notes: '',
                });
                setCurrentEntry(response.data.data);
            } else {
                const newStatus = currentEntry.status === 'completed' ? 'empty' : 'completed';
                await entryAPI.updateStatus(currentEntry.id, newStatus);
                setCurrentEntry((prev) => ({ ...prev, status: newStatus }));
            }
            onUpdate();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!notes.trim() && !currentEntry) return;
        try {
            const entry = await ensureEntry();
            if (!entry) return;
            await entryAPI.upsert({
                tracker_id: tracker.id,
                entry_date: dateStr,
                status: entry.status || 'empty',
                notes: notes,
            });
            onUpdate();
        } catch (error) {
            console.error('Failed to save notes:', error);
        }
    };

    const isCompleted = currentEntry?.status === 'completed';
    const completedCount = tasks.filter((t) => t.completed).length;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-border"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: tracker.color || '#3B82F6' }}
                            >
                                <Check className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold leading-tight">{tracker.name}</h2>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(year, month - 1, day).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Status Toggle — large, prominent */}
                        <button
                            onClick={handleToggleDayStatus}
                            disabled={loading}
                            className={cn(
                                'w-full py-4 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3',
                                isCompleted
                                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30'
                                    : 'bg-secondary hover:bg-secondary/80 border-2 border-dashed border-border'
                            )}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : isCompleted ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Day Completed! Click to undo
                                </>
                            ) : (
                                <>
                                    <div className="w-5 h-5 rounded-full border-2 border-current opacity-60" />
                                    Mark Day as Complete
                                </>
                            )}
                        </button>

                        {/* Tasks Section */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">
                                    Tasks
                                    {tasks.length > 0 && (
                                        <span className="ml-2 text-sm text-muted-foreground font-normal">
                                            {completedCount}/{tasks.length} done
                                        </span>
                                    )}
                                </h3>
                                {tasks.length > 0 && (
                                    <div className="h-1.5 w-24 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                                            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Task List */}
                            <div className="space-y-2 mb-3">
                                <AnimatePresence>
                                    {tasks.map((task) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg hover:bg-secondary/60 transition-colors group"
                                        >
                                            <button
                                                onClick={() => handleToggleTask(task)}
                                                className={cn(
                                                    'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                                                    task.completed
                                                        ? 'bg-green-500 border-green-500'
                                                        : 'border-muted-foreground/40 hover:border-green-500'
                                                )}
                                            >
                                                {task.completed && <Check className="w-3 h-3 text-white" />}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className={cn(
                                                        'text-sm font-medium truncate',
                                                        task.completed && 'line-through opacity-50'
                                                    )}
                                                >
                                                    {task.title}
                                                </div>
                                                {task.description && (
                                                    <div className="text-xs text-muted-foreground truncate">
                                                        {task.description}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {tasks.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-3">
                                        No tasks yet — add one below
                                    </p>
                                )}
                            </div>

                            {/* Add Task — inline, frictionless */}
                            <div className="flex gap-2">
                                <input
                                    ref={taskInputRef}
                                    type="text"
                                    placeholder="Add a task... (Enter to save)"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 px-3 py-2 bg-secondary/40 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/60"
                                />
                                <button
                                    onClick={handleAddTask}
                                    disabled={!newTaskTitle.trim() || taskLoading}
                                    className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-opacity"
                                >
                                    {taskLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold mb-2">
                                <StickyNote className="w-4 h-4" />
                                Notes
                            </label>
                            <textarea
                                placeholder="Add notes for this day..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onBlur={handleSaveNotes}
                                rows={3}
                                className="w-full px-3 py-2 bg-secondary/40 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-muted-foreground/60"
                            />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DayModal;
