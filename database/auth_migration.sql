-- ============================================
-- AUTH MIGRATION: Enable RLS + Google OAuth support
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Delete the old shared seed trackers (user_id = NULL)
DELETE FROM tasks WHERE entry_id IN (
  SELECT e.id FROM entries e
  JOIN trackers t ON t.id = e.tracker_id
  WHERE t.user_id IS NULL
);
DELETE FROM entries WHERE tracker_id IN (SELECT id FROM trackers WHERE user_id IS NULL);
DELETE FROM trackers WHERE user_id IS NULL;

-- Step 2: Enable Row Level Security
ALTER TABLE trackers ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks    ENABLE ROW LEVEL SECURITY;

-- Step 3: RLS policy for trackers
CREATE POLICY "Users manage own trackers" ON trackers
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Step 4: RLS policy for entries (checks ownership via trackers)
CREATE POLICY "Users manage own entries" ON entries
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trackers
      WHERE trackers.id = entries.tracker_id
        AND trackers.user_id = auth.uid()
    )
  );

-- Step 5: RLS policy for tasks (checks ownership via entries → trackers)
CREATE POLICY "Users manage own tasks" ON tasks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM entries
      JOIN trackers ON trackers.id = entries.tracker_id
      WHERE entries.id = tasks.entry_id
        AND trackers.user_id = auth.uid()
    )
  );

-- ============================================
-- VERIFY: After running, check that RLS is on
-- ============================================
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN ('trackers','entries','tasks');
