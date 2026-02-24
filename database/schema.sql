-- Improvement Tracker Database Schema for Supabase (PostgreSQL)
-- Run this in the Supabase SQL Editor

-- ============================================
-- TABLE: trackers
-- Stores the 4 main tracking categories
-- ============================================
CREATE TABLE IF NOT EXISTS trackers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for MVP (no auth)
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'athikramana', 'career', 'daily', 'custom'
  description TEXT,
  color VARCHAR(7) DEFAULT '#10B981', -- Hex color code
  icon VARCHAR(50), -- Optional icon identifier
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: entries
-- Daily entries for each tracker
-- ============================================
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracker_id UUID REFERENCES trackers(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'empty', -- 'empty', 'completed', 'missed'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tracker_id, entry_date) -- One entry per day per tracker
);

-- ============================================
-- TABLE: tasks
-- Individual tasks/works for each daily entry
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES entries(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_entries_tracker_date ON entries(tracker_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_tasks_entry ON tasks(entry_id);
CREATE INDEX IF NOT EXISTS idx_trackers_user ON trackers(user_id);

-- ============================================
-- SEED DATA: The 4 Default Trackers
-- ============================================
INSERT INTO trackers (name, type, description, color) VALUES
  ('Athikramana Tracker', 'athikramana', '52-week self-improvement program - Currently Week 3', '#8B5CF6'),
  ('Career Development', 'career', 'Engineering & Software Development Skills', '#3B82F6'),
  ('Daily Checkpoints', 'daily', 'Routine habits and daily goals', '#10B981'),
  ('Custom Tracker', 'custom', 'Flexible personal tracking', '#F59E0B')
ON CONFLICT DO NOTHING;

-- ============================================
-- OPTIONAL: Row Level Security (RLS)
-- Uncomment when implementing authentication
-- ============================================
-- ALTER TABLE trackers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- -- Allow users to see only their trackers
-- CREATE POLICY "Users can view their own trackers" ON trackers
--   FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- CREATE POLICY "Users can create their own trackers" ON trackers
--   FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CREATE POLICY "Users can update their own trackers" ON trackers
--   FOR UPDATE USING (auth.uid() = user_id);

-- -- Similar policies for entries and tasks
-- CREATE POLICY "Users can manage their entries" ON entries
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM trackers
--       WHERE trackers.id = entries.tracker_id
--       AND (trackers.user_id = auth.uid() OR trackers.user_id IS NULL)
--     )
--   );

-- CREATE POLICY "Users can manage their tasks" ON tasks
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM entries
--       JOIN trackers ON trackers.id = entries.tracker_id
--       WHERE entries.id = tasks.entry_id
--       AND (trackers.user_id = auth.uid() OR trackers.user_id IS NULL)
--     )
--   );
