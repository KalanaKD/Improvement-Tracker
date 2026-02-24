import { supabaseAdmin } from '../config/database.js';

const DEFAULT_TRACKERS = [
    {
        name: 'Athikramana Tracker',
        type: 'athikramana',
        description: '52-week self-improvement program',
        color: '#8B5CF6',
    },
    {
        name: 'Career Development',
        type: 'career',
        description: 'Engineering & Software Development Skills',
        color: '#3B82F6',
    },
    {
        name: 'Daily Checkpoints',
        type: 'daily',
        description: 'Routine habits and daily goals',
        color: '#10B981',
    },
    {
        name: 'Custom Tracker',
        type: 'custom',
        description: 'Flexible personal tracking',
        color: '#F59E0B',
    },
];

export const provisionService = {
    /**
     * Ensures a user has their 4 default trackers.
     * Uses the admin (service role) client to bypass RLS.
     * Safe to call multiple times — idempotent.
     */
    async provisionUser(userId) {
        if (!supabaseAdmin) {
            throw new Error('Service role key not configured. Cannot provision user.');
        }

        try {
            // Check if user already has trackers
            const { data: existing, error: checkError } = await supabaseAdmin
                .from('trackers')
                .select('id')
                .eq('user_id', userId);

            if (checkError) throw checkError;

            // Already provisioned — skip
            if (existing && existing.length >= 4) {
                return { provisioned: false, message: 'User already has trackers' };
            }

            // Create the 4 default trackers for this user
            const trackersToInsert = DEFAULT_TRACKERS.map((t) => ({
                ...t,
                user_id: userId,
            }));

            const { data, error } = await supabaseAdmin
                .from('trackers')
                .insert(trackersToInsert)
                .select();

            if (error) throw error;

            console.log(`✅ Provisioned 4 trackers for user ${userId}`);
            return { provisioned: true, trackers: data };
        } catch (error) {
            throw new Error(`Failed to provision user: ${error.message}`);
        }
    },
};
