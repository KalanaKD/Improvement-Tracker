import { trackerService } from '../services/trackerService.js';

// Helper to extract the raw JWT from the Authorization header
const getToken = (req) => req.headers.authorization?.replace('Bearer ', '');

export const trackerController = {
    async getAllTrackers(req, res) {
        try {
            const token = getToken(req);
            const trackers = await trackerService.getAllTrackers(req.user.id, token);
            res.json({ success: true, data: trackers });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async getTrackerById(req, res) {
        try {
            const { id } = req.params;
            const token = getToken(req);
            const tracker = await trackerService.getTrackerById(id, token);
            res.json({ success: true, data: tracker });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async updateTracker(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const token = getToken(req);
            const tracker = await trackerService.updateTracker(id, updates, token);
            res.json({ success: true, data: tracker });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
};
