import { supabaseAdmin, getUserClient } from '../config/database.js';

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
     * Tries admin client first (bypasses RLS), falls back to user-scoped client.
     * Safe to call multiple times — idempotent.
     */
    async provisionUser(userId, token) {
        // Use admin client if available, otherwise use the user's own JWT
        const client = supabaseAdmin || getUserClient(token);

        try {
            // Check if user already has trackers
            const { data: existing, error: checkError } = await client
                .from('trackers')
                .select('id')
                .eq('user_id', userId);

            if (checkError) throw checkError;

            // Already provisioned — skip
            if (existing && existing.length >= 4) {
                return { provisioned: false, message: 'User already has trackers' };
            }

            // Determine which trackers to insert (avoid duplicates if partially provisioned)
            const existingCount = existing ? existing.length : 0;
            const trackersToInsert = DEFAULT_TRACKERS.slice(existingCount).map((t) => ({
                ...t,
                user_id: userId,
            }));

            if (trackersToInsert.length === 0) {
                return { provisioned: false, message: 'User already has trackers' };
            }

            const { data, error } = await client
                .from('trackers')
                .insert(trackersToInsert)
                .select();

            if (error) throw error;

            console.log(`✅ Provisioned ${trackersToInsert.length} tracker(s) for user ${userId}`);
            return { provisioned: true, trackers: data };
        } catch (error) {
            throw new Error(`Failed to provision user: ${error.message}`);
        }
    },
};
