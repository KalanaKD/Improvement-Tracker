import express from 'express';
import { trackerController } from '../controllers/trackerController.js';
import { entryController } from '../controllers/entryController.js';
import { taskController } from '../controllers/taskController.js';
import { statsController } from '../controllers/statsController.js';
import { provisionService } from '../services/provisionService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to ALL routes
router.use(authMiddleware);

// ─── Auth: Provision new user ────────────────────────────────────────────────
router.post('/auth/provision', async (req, res) => {
    try {
        const result = await provisionService.provisionUser(req.user.id);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─── Tracker routes ───────────────────────────────────────────────────────────
router.get('/trackers', trackerController.getAllTrackers);
router.get('/trackers/:id', trackerController.getTrackerById);
router.put('/trackers/:id', trackerController.updateTracker);

// ─── Entry routes ─────────────────────────────────────────────────────────────
router.get('/trackers/:trackerId/entries', entryController.getEntriesForMonth);
router.post('/entries', entryController.upsertEntry);
router.put('/entries/:id/status', entryController.updateEntryStatus);
router.delete('/entries/:id', entryController.deleteEntry);

// ─── Task routes ──────────────────────────────────────────────────────────────
router.get('/entries/:entryId/tasks', taskController.getTasksForEntry);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// ─── Stats routes ─────────────────────────────────────────────────────────────
router.get('/stats/tracker/:trackerId', statsController.getMonthlyStats);
router.get('/stats/all', statsController.getAllTrackersStats);

export default router;
