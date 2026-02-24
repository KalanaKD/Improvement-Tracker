import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment variables');
    process.exit(1);
}

// Regular client (respects RLS — used for user requests)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client (bypasses RLS — used only for provisioning new users)
export const supabaseAdmin = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    })
    : null;

// Test connection
export const testConnection = async () => {
    try {
        const { error } = await supabase.from('trackers').select('count');
        // 406 is expected when RLS is enabled and no user is logged in — that's fine
        if (error && error.code !== 'PGRST116' && !error.message.includes('RLS')) {
            console.warn('DB warning:', error.message);
        }
        console.log('✅ Database connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};
