import { getUserClient } from '../config/database.js';

export const taskService = {
    // Get tasks for an entry
    async getTasksForEntry(entryId, token) {
        try {
            const client = getUserClient(token);
            const { data, error } = await client
                .from('tasks')
                .select('*')
                .eq('entry_id', entryId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch tasks: ${error.message}`);
        }
    },

    // Create a task
    async createTask(taskData, token) {
        try {
            const client = getUserClient(token);
            const { entry_id, title, description, completed } = taskData;

            const { data, error } = await client
                .from('tasks')
                .insert([{ entry_id, title, description, completed: completed || false }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to create task: ${error.message}`);
        }
    },

    // Update task
    async updateTask(taskId, updates, token) {
        try {
            const client = getUserClient(token);
            const { data, error } = await client
                .from('tasks')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', taskId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update task: ${error.message}`);
        }
    },

    // Delete task
    async deleteTask(taskId, token) {
        try {
            const client = getUserClient(token);
            const { error } = await client
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            throw new Error(`Failed to delete task: ${error.message}`);
        }
    },
};
