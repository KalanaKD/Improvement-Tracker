import { statsService } from '../services/statsService.js';

export const statsController = {
    async getMonthlyStats(req, res) {
        try {
            const { trackerId } = req.params;
            const { year, month } = req.query;

            if (!year || !month) {
                return res.status(400).json({ success: false, error: 'Year and month are required' });
            }

            const stats = await statsService.getMonthlyStats(trackerId, parseInt(year), parseInt(month));
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async getAllTrackersStats(req, res) {
        try {
            const { tracker_ids, year, month } = req.query;

            if (!year || !month || !tracker_ids) {
                return res.status(400).json({ success: false, error: 'Year, month, and tracker_ids are required' });
            }

            const trackerIds = tracker_ids.split(',');
            const stats = await statsService.getAllTrackersStats(trackerIds, parseInt(year), parseInt(month));
            res.json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
};
