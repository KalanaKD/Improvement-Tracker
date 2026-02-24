import { entryService } from '../services/entryService.js';

export const entryController = {
    async getEntriesForMonth(req, res) {
        try {
            const { trackerId } = req.params;
            const { year, month } = req.query;

            if (!year || !month) {
                return res.status(400).json({ success: false, error: 'Year and month are required' });
            }

            const entries = await entryService.getEntriesForMonth(trackerId, parseInt(year), parseInt(month));
            res.json({ success: true, data: entries });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async upsertEntry(req, res) {
        try {
            const entryData = req.body;
            const entry = await entryService.upsertEntry(entryData);
            res.json({ success: true, data: entry });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async updateEntryStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const entry = await entryService.updateEntryStatus(id, status);
            res.json({ success: true, data: entry });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async deleteEntry(req, res) {
        try {
            const { id } = req.params;
            await entryService.deleteEntry(id);
            res.json({ success: true, message: 'Entry deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
};
