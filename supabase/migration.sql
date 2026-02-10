-- =====================================================
-- WINDSURF PROMPT CHEATSHEET - DATABASE MIGRATION
-- Simple schema with admin boolean
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE (with admin boolean)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT,
  admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. USER_PROJECTS TABLE (many-to-many)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- =====================================================
-- 4. PROMPTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  prompt_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('database', 'integration', 'ui-ux', 'content')),
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  level TEXT DEFAULT 'mid' CHECK (level IN ('junior', 'mid', 'senior')),
  example_context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 5. USER_PROJECTS_PROMPTS TABLE (links prompts to user-project assignments)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_projects_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_project_id, prompt_id)
);

-- =====================================================
-- INDEXES for better performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_admin ON public.users(admin);
CREATE INDEX IF NOT EXISTS idx_user_projects_user ON public.user_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_project ON public.user_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_prompts_up ON public.user_projects_prompts(user_project_id);
CREATE INDEX IF NOT EXISTS idx_user_projects_prompts_prompt ON public.user_projects_prompts(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts(category);

-- =====================================================
-- TRIGGERS for updated_at timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER prompts_updated_at BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- SEED DATA: Admin user (production@mutant.ae)
-- Password: Admin@12345
-- =====================================================
INSERT INTO public.users (email, password, full_name, admin)
VALUES ('production@mutant.ae', 'Admin@12345', 'Admin User', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Note: For production, implement proper password hashing with bcrypt
-- This uses plain text for development simplicity

-- =====================================================
-- SEED DATA: Sample projects
-- =====================================================
INSERT INTO public.projects (name, description)
VALUES 
  ('Windsurf AI Assistant', 'AI-powered development assistant project'),
  ('E-commerce Platform', 'Full-stack e-commerce solution'),
  ('Analytics Dashboard', 'Real-time analytics and reporting system')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE!
-- =====================================================
-- Now you have:
-- 1. users table with admin boolean
-- 2. projects table
-- 3. user_projects table (many-to-many)
-- 4. prompts table
-- 5. user_projects_prompts table
-- 6. Admin user: production@mutant.ae / Admin@12345
-- 7. 3 sample projects
