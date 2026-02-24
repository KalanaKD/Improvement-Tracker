import { trackerService } from '../services/trackerService.js';

export const trackerController = {
    async getAllTrackers(req, res) {
        try {
            const { user_id } = req.query;
            const trackers = await trackerService.getAllTrackers(user_id);
            res.json({ success: true, data: trackers });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async getTrackerById(req, res) {
        try {
            const { id } = req.params;
            const tracker = await trackerService.getTrackerById(id);
            res.json({ success: true, data: tracker });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async updateTracker(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const tracker = await trackerService.updateTracker(id, updates);
            res.json({ success: true, data: tracker });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
};
