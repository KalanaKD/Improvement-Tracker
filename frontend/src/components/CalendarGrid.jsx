import { motion } from 'framer-motion';
import { getDaysInMonth, getFirstDayOfMonth, cn } from '../lib/utils';

const CalendarGrid = ({ year, month, entries = [], onDayClick, trackerColor = '#10B981' }) => {
    // Compute directly — no useState/useEffect needed, these are pure functions of props
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
    const todayDay = today.getDate();

    const getEntryForDay = (day) => {
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return entries.find((entry) => entry.entry_date === dateStr);
    };

    const renderDays = () => {
        const days = [];

        // Empty cells before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="day-cell opacity-0 pointer-events-none" />);
        }

        // Actual day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const entry = getEntryForDay(day);
            const isCompleted = entry?.status === 'completed';
            const isMissed = entry?.status === 'missed';
            const isToday = isCurrentMonth && day === todayDay;

            days.push(
                <motion.div
                    key={day}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                        'day-cell relative text-sm font-medium',
                        isCompleted ? 'text-white shadow-md' : isMissed ? 'text-white' : 'day-empty',
                        isToday && !isCompleted && !isMissed && 'day-today'
                    )}
                    style={isCompleted && trackerColor ? { backgroundColor: trackerColor } : isMissed ? { backgroundColor: '#EF4444' } : {}}
                    onClick={() => onDayClick(day, entry)}
                    title={entry?.status ? `Status: ${entry.status}` : 'Click to log'}
                >
                    {day}
                    {isToday && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-70" />
                    )}
                </motion.div>
            );
        }

        return days;
    };

    return (
        <div className="w-full">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-xs font-semibold text-muted-foreground py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
        </div>
    );
};

export default CalendarGrid;
