import { supabase } from '../config/database.js';

export const trackerService = {
    // Get all trackers (optionally filtered by user_id for future auth)
    async getAllTrackers(userId = null) {
        try {
            let query = supabase.from('trackers').select('*');

            if (userId) {
                query = query.eq('user_id', userId);
            } else {
                // For MVP: get trackers without user_id (public trackers)
                query = query.is('user_id', null);
            }

            const { data, error } = await query.order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch trackers: ${error.message}`);
        }
    },

    // Get single tracker by ID
    async getTrackerById(trackerId) {
        try {
            const { data, error } = await supabase
                .from('trackers')
                .select('*')
                .eq('id', trackerId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch tracker: ${error.message}`);
        }
    },

    // Update tracker (e.g., custom color)
    async updateTracker(trackerId, updates) {
        try {
            const { data, error } = await supabase
                .from('trackers')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', trackerId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update tracker: ${error.message}`);
        }
    },
};
