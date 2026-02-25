import { getUserClient } from '../config/database.js';

export const entryService = {
    // Get entries for a tracker within a month
    async getEntriesForMonth(trackerId, year, month, token) {
        try {
            const client = getUserClient(token);
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const endDate = new Date(year, month, 0); // Last day of month
            const endDateStr = `${year}-${String(month).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

            const { data, error } = await client
                .from('entries')
                .select('*, tasks(*)')
                .eq('tracker_id', trackerId)
                .gte('entry_date', startDate)
                .lte('entry_date', endDateStr)
                .order('entry_date', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch entries: ${error.message}`);
        }
    },

    // Create or update an entry
    async upsertEntry(entryData, token) {
        try {
            const client = getUserClient(token);
            const { tracker_id, entry_date, status, notes } = entryData;

            const { data, error } = await client
                .from('entries')
                .upsert(
                    {
                        tracker_id,
                        entry_date,
                        status,
                        notes,
                        updated_at: new Date().toISOString(),
                    },
                    {
                        onConflict: 'tracker_id,entry_date',
                    }
                )
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to upsert entry: ${error.message}`);
        }
    },

    // Update entry status
    async updateEntryStatus(entryId, status, token) {
        try {
            const client = getUserClient(token);
            const { data, error } = await client
                .from('entries')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', entryId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to update entry status: ${error.message}`);
        }
    },

    // Delete entry
    async deleteEntry(entryId, token) {
        try {
            const client = getUserClient(token);
            const { error } = await client
                .from('entries')
                .delete()
                .eq('id', entryId);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            throw new Error(`Failed to delete entry: ${error.message}`);
        }
    },
};
