import { motion } from 'framer-motion';
import CalendarGrid from './CalendarGrid';
import { Calendar as CalendarIcon, Flame } from 'lucide-react';

const TrackerCard = ({ tracker, entries, year, month, onDayClick, stats }) => {
    const completionRate = stats?.completion_rate
        ? Math.round(stats.completion_rate * 100)
        : 0;

    const completedDays = stats?.completed_days || 0;
    const totalDays = stats?.total_days || 0;
    const missedDays = stats?.missed_days || 0;

    return (
        <div className="glassmorphism p-5 rounded-2xl border border-border shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                        style={{ backgroundColor: tracker.color || '#3B82F6' }}
                    >
                        <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-bold leading-tight truncate">{tracker.name}</h3>
                        {tracker.description && (
                            <p className="text-xs text-muted-foreground truncate">{tracker.description}</p>
                        )}
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                    <div className="text-3xl font-bold tabular-nums" style={{ color: tracker.color || '#3B82F6' }}>
                        {completionRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">this month</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-secondary rounded-full mb-4 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: tracker.color || '#3B82F6' }}
                />
            </div>

            {/* Stats Row */}
            {stats && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-green-500/10 rounded-lg">
                        <div className="text-lg font-bold text-green-500">{completedDays}</div>
                        <div className="text-xs text-muted-foreground">Done</div>
                    </div>
                    <div className="text-center p-2 bg-red-500/10 rounded-lg">
                        <div className="text-lg font-bold text-red-500">{missedDays}</div>
                        <div className="text-xs text-muted-foreground">Missed</div>
                    </div>
                    <div className="text-center p-2 bg-secondary/50 rounded-lg">
                        <div className="text-lg font-bold text-muted-foreground">
                            {totalDays - completedDays - missedDays}
                        </div>
                        <div className="text-xs text-muted-foreground">Empty</div>
                    </div>
                </div>
            )}

            {/* Calendar */}
            <div className="flex-1">
                <CalendarGrid
                    year={year}
                    month={month}
                    entries={entries}
                    onDayClick={(day, entry) => onDayClick(tracker, day, entry)}
                    trackerColor={tracker.color}
                />
            </div>
        </div>
    );
};

export default TrackerCard;
