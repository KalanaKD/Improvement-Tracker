import { taskService } from '../services/taskService.js';

export const taskController = {
    async getTasksForEntry(req, res) {
        try {
            const { entryId } = req.params;
            const tasks = await taskService.getTasksForEntry(entryId);
            res.json({ success: true, data: tasks });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async createTask(req, res) {
        try {
            const taskData = req.body;
            const task = await taskService.createTask(taskData);
            res.json({ success: true, data: task });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const task = await taskService.updateTask(id, updates);
            res.json({ success: true, data: task });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            await taskService.deleteTask(id);
            res.json({ success: true, message: 'Task deleted successfully' });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },
};
