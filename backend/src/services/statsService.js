import { supabase } from '../config/database.js';

export const statsService = {
    // Get completion statistics for a tracker in a given month
    async getMonthlyStats(trackerId, year, month) {
        try {
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const endDate = new Date(year, month, 0);
            const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

            const { data, error } = await supabase
                .from('entries')
                .select('status')
                .eq('tracker_id', trackerId)
                .gte('entry_date', startDate)
                .lte('entry_date', endDateStr);

            if (error) throw error;

            const totalDays = endDate.getDate();
            const completedDays = data.filter(e => e.status === 'completed').length;
            const missedDays = data.filter(e => e.status === 'missed').length;
            const emptyDays = totalDays - data.length;

            return {
                total_days: totalDays,
                completed_days: completedDays,
                missed_days: missedDays,
                empty_days: emptyDays,
                completion_rate: totalDays > 0 ? (completedDays / totalDays) : 0,
            };
        } catch (error) {
            throw new Error(`Failed to calculate stats: ${error.message}`);
        }
    },

    // Get aggregated stats for all trackers
    async getAllTrackersStats(trackerIds, year, month) {
        try {
            const promises = trackerIds.map(id => this.getMonthlyStats(id, year, month));
            const results = await Promise.all(promises);

            return trackerIds.map((id, index) => ({
                tracker_id: id,
                ...results[index],
            }));
        } catch (error) {
            throw new Error(`Failed to calculate aggregated stats: ${error.message}`);
        }
    },
};
