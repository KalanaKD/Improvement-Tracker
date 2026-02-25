import { taskService } from '../services/taskService.js';

const getToken = (req) => req.headers.authorization?.replace('Bearer ', '');

export const taskController = {
    async getTasksForEntry(req, res) {
        try {
            const { entryId } = req.params;
            const token = getToken(req);
            const tasks = await taskService.getTasksForEntry(entryId, token);
            res.json({ success: true, data: tasks });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async createTask(req, res) {
        try {
            const taskData = req.body;
            const token = getToken(req);
            const task = await taskService.createTask(taskData, token);
            res.json({ success: true, data: task });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const token = getToken(req);
            const task = await taskService.updateTask(id, updates, token);
            res.json({ success: true, data: task });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            const token = getToken(req);
            await taskService.deleteTask(id, token);
            res.json({ success: true, message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
};
