-- KYE Data Analysis Workspace Database Schema
-- PostgreSQL

-- =============================================
-- 1. SESSIONS TABLE
-- =============================================
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);

-- =============================================
-- 2. FILES TABLE
-- =============================================
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_path TEXT,  -- stored in S3 or local
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for session lookups
CREATE INDEX idx_files_session_id ON files(session_id);

-- =============================================
-- 3. FILE_HEADERS TABLE
-- =============================================
CREATE TABLE file_headers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  original_header TEXT NOT NULL,         -- raw header from Excel
  normalized_header TEXT NOT NULL,       -- lowercase, trimmed
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for file lookups
CREATE INDEX idx_file_headers_file_id ON file_headers(file_id);
CREATE INDEX idx_file_headers_normalized ON file_headers(normalized_header);

-- =============================================
-- 4. HEADER_GROUPS TABLE
-- =============================================
CREATE TABLE header_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  group_name TEXT,           -- optional label
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for session lookups
CREATE INDEX idx_header_groups_session_id ON header_groups(session_id);

-- =============================================
-- 5. HEADER_GROUP_ITEMS TABLE
-- =============================================
CREATE TABLE header_group_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  header_group_id UUID NOT NULL REFERENCES header_groups(id) ON DELETE CASCADE,
  header_id UUID NOT NULL REFERENCES file_headers(id) ON DELETE CASCADE,
  UNIQUE(header_group_id, header_id)
);

-- Indexes
CREATE INDEX idx_header_group_items_group_id ON header_group_items(header_group_id);
CREATE INDEX idx_header_group_items_header_id ON header_group_items(header_id);

-- =============================================
-- 6. HEADER_ALIASES TABLE
-- =============================================
CREATE TABLE header_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  header_group_id UUID NOT NULL REFERENCES header_groups(id) ON DELETE CASCADE,
  alias_name TEXT NOT NULL,   -- final alias given by user: "Transaction Date"
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, header_group_id)
);

-- Index for session lookups
CREATE INDEX idx_header_aliases_session_id ON header_aliases(session_id);

-- =============================================
-- 7. CHAT_MESSAGES TABLE
-- =============================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  metadata JSONB,   -- may contain chart-data output
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Index for session lookups
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for sessions table
CREATE TRIGGER update_sessions_updated_at 
    BEFORE UPDATE ON sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE QUERIES
-- =============================================

-- Get all sessions with file count
-- SELECT 
--   s.id,
--   s.title,
--   s.created_at,
--   s.updated_at,
--   COUNT(f.id) as file_count
-- FROM sessions s
-- LEFT JOIN files f ON s.id = f.session_id
-- GROUP BY s.id
-- ORDER BY s.updated_at DESC;

-- Get all files with headers for a session
-- SELECT 
--   f.id,
--   f.file_name,
--   json_agg(
--     json_build_object(
--       'original', fh.original_header,
--       'normalized', fh.normalized_header
--     )
--   ) as headers
-- FROM files f
-- JOIN file_headers fh ON f.id = fh.file_id
-- WHERE f.session_id = 'session-uuid-here'
-- GROUP BY f.id;

-- Get header groups with aliases for a session
-- SELECT 
--   hg.id,
--   hg.group_name,
--   ha.alias_name,
--   json_agg(
--     json_build_object(
--       'header', fh.original_header,
--       'file', f.file_name
--     )
--   ) as headers
-- FROM header_groups hg
-- LEFT JOIN header_aliases ha ON hg.id = ha.header_group_id
-- JOIN header_group_items hgi ON hg.id = hgi.header_group_id
-- JOIN file_headers fh ON hgi.header_id = fh.id
-- JOIN files f ON fh.file_id = f.id
-- WHERE hg.session_id = 'session-uuid-here'
-- GROUP BY hg.id, ha.alias_name;
