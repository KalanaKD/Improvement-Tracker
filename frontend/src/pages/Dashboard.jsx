import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronLeft, ChevronRight, CalendarDays, LogOut } from 'lucide-react';
import TrackerCard from '../components/TrackerCard';
import ProgressChart from '../components/ProgressChart';
import DayModal from '../components/DayModal';
import ThemeToggle from '../components/ThemeToggle';
import { trackerAPI, entryAPI, statsAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const Dashboard = () => {
    const { user, signOut, lastProvision } = useAuth();
    const realNow = new Date();
    const [viewYear, setViewYear] = useState(realNow.getFullYear());
    const [viewMonth, setViewMonth] = useState(realNow.getMonth() + 1);

    const [trackers, setTrackers] = useState([]);
    const [entries, setEntries] = useState({});
    const [stats, setStats] = useState({});
    const [chartStats, setChartStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTracker, setSelectedTracker] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const isCurrentMonth =
        viewYear === realNow.getFullYear() && viewMonth === realNow.getMonth() + 1;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const trackersRes = await trackerAPI.getAll();
            const trackersData = trackersRes.data.data;
            setTrackers(trackersData);

            const entriesMap = {};
            const statsMap = {};

            await Promise.all(
                trackersData.map(async (tracker) => {
                    const [entriesRes, statsRes] = await Promise.all([
                        entryAPI.getForMonth(tracker.id, viewYear, viewMonth),
                        statsAPI.getMonthly(tracker.id, viewYear, viewMonth),
                    ]);
                    entriesMap[tracker.id] = entriesRes.data.data;
                    statsMap[tracker.id] = statsRes.data.data;
                })
            );

            setEntries(entriesMap);
            setStats(statsMap);

            setChartStats(
                trackersData.map((tracker) => ({
                    name: tracker.name,
                    completed_days: statsMap[tracker.id]?.completed_days || 0,
                    total_days: statsMap[tracker.id]?.total_days || 1,
                    completion_rate: statsMap[tracker.id]?.completion_rate || 0,
                    color: tracker.color,
                }))
            );
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    }, [viewYear, viewMonth]);

    useEffect(() => {
        fetchData();
    }, [fetchData, lastProvision]);

    const goToPrevMonth = () => {
        if (viewMonth === 1) {
            setViewMonth(12);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    };

    const goToNextMonth = () => {
        if (viewMonth === 12) {
            setViewMonth(1);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    };

    const goToToday = () => {
        setViewYear(realNow.getFullYear());
        setViewMonth(realNow.getMonth() + 1);
    };

    const handleDayClick = (tracker, day, entry) => {
        setSelectedTracker(tracker);
        setSelectedDay(day);
        setSelectedEntry(entry || null);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedTracker(null);
        setSelectedDay(null);
        setSelectedEntry(null);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3">
                    {/* Row 1: Logo + Right controls */}
                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-0">
                        {/* Logo */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-base sm:text-xl font-bold leading-tight truncate">Improvement Tracker</h1>
                                <p className="text-xs text-muted-foreground hidden sm:block">
                                    {realNow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Month Navigation — desktop only (hidden on mobile) */}
                        <div className="hidden sm:flex items-center gap-1 bg-secondary/50 rounded-xl p-1">
                            <button
                                onClick={goToPrevMonth}
                                className="p-1.5 hover:bg-card rounded-lg transition-colors"
                                title="Previous month"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="px-3 py-1 text-sm font-semibold min-w-[130px] text-center">
                                {MONTH_NAMES[viewMonth - 1]} {viewYear}
                            </div>
                            <button
                                onClick={goToNextMonth}
                                className="p-1.5 hover:bg-card rounded-lg transition-colors"
                                title="Next month"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            {!isCurrentMonth && (
                                <button
                                    onClick={goToToday}
                                    className="ml-1 px-2.5 py-1 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                                >
                                    <CalendarDays className="w-3 h-3" />
                                    Today
                                </button>
                            )}
                        </div>

                        {/* Right controls — always visible */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <ThemeToggle />
                            <div className="flex items-center gap-2 pl-2 border-l border-border">
                                {user?.user_metadata?.avatar_url && (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="avatar"
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-border"
                                    />
                                )}
                                <span className="text-xs text-muted-foreground hidden md:block max-w-[120px] truncate">
                                    {user?.user_metadata?.full_name || user?.email}
                                </span>
                                <button
                                    onClick={signOut}
                                    title="Sign out"
                                    className="p-1.5 sm:p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Month Navigation — full width centred on mobile, inline on desktop */}
                    <div className="flex justify-center sm:hidden">
                        <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1">
                            <button
                                onClick={goToPrevMonth}
                                className="p-1.5 hover:bg-card rounded-lg transition-colors"
                                title="Previous month"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="px-3 py-1 text-sm font-semibold min-w-[140px] text-center">
                                {MONTH_NAMES[viewMonth - 1]} {viewYear}
                            </div>
                            <button
                                onClick={goToNextMonth}
                                className="p-1.5 hover:bg-card rounded-lg transition-colors"
                                title="Next month"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            {!isCurrentMonth && (
                                <button
                                    onClick={goToToday}
                                    className="ml-1 px-2.5 py-1 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                                >
                                    <CalendarDays className="w-3 h-3" />
                                    Today
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                            />
                            <p className="text-sm text-muted-foreground">Loading your progress...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Progress Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 glassmorphism p-5 rounded-2xl border border-border shadow-xl"
                        >
                            <ProgressChart
                                stats={chartStats}
                                title={`${MONTH_NAMES[viewMonth - 1]} ${viewYear} — Progress Overview`}
                            />
                        </motion.div>

                        {/* Trackers Grid */}
                        {trackers.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <CalendarDays className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                <h2 className="text-xl font-semibold mb-2">No Trackers Found</h2>
                                <p className="text-sm text-muted-foreground">
                                    Please set up your Supabase database and seed the default trackers.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {trackers.map((tracker, i) => (
                                    <motion.div
                                        key={tracker.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                    >
                                        <TrackerCard
                                            tracker={tracker}
                                            entries={entries[tracker.id] || []}
                                            year={viewYear}
                                            month={viewMonth}
                                            onDayClick={handleDayClick}
                                            stats={stats[tracker.id]}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Day Modal */}
            {modalOpen && selectedTracker && (
                <DayModal
                    isOpen={modalOpen}
                    onClose={handleModalClose}
                    tracker={selectedTracker}
                    day={selectedDay}
                    year={viewYear}
                    month={viewMonth}
                    entry={selectedEntry}
                    onUpdate={fetchData}
                />
            )}
        </div>
    );
};

export default Dashboard;
