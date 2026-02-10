-- Windsurf Prompt Cheatsheet Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create the prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ui-ux', 'backend')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts;
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (adjust based on your auth needs)
CREATE POLICY "Allow all operations on prompts" ON prompts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert sample UI/UX prompts
INSERT INTO prompts (title, description, prompt_text, category, tags) VALUES
(
  'Create Responsive Component',
  'Generate a responsive React component with Tailwind CSS',
  'Create a responsive [component name] component using React and Tailwind CSS. It should:
- Be mobile-first with breakpoints for sm, md, lg, xl
- Use semantic HTML elements
- Include proper accessibility attributes (aria-labels, roles)
- Follow the existing design system patterns
- Include hover and focus states',
  'ui-ux',
  ARRAY['react', 'tailwind', 'responsive', 'accessibility']
),
(
  'Design System Token Setup',
  'Set up design tokens for consistent styling',
  'Help me set up design tokens in Tailwind CSS for:
- Color palette (primary, secondary, accent, neutral, semantic colors)
- Typography scale (font sizes, weights, line heights)
- Spacing scale (consistent padding/margin values)
- Border radius values
- Shadow definitions
- Breakpoint definitions

Follow the existing project conventions and ensure tokens are easily maintainable.',
  'ui-ux',
  ARRAY['design-system', 'tailwind', 'tokens', 'styling']
),
(
  'Form with Validation',
  'Build accessible form with client-side validation',
  'Create a [form type] form with the following:
- Input fields for: [list fields]
- Client-side validation using [library or native]
- Error messages displayed inline
- Loading state on submit
- Success/error toast notifications
- Accessible labels and error announcements
- Keyboard navigation support',
  'ui-ux',
  ARRAY['forms', 'validation', 'accessibility', 'react']
),
(
  'Animation and Transitions',
  'Add smooth animations to UI components',
  'Add smooth animations to [component/page]:
- Use CSS transitions or Framer Motion
- Include enter/exit animations
- Respect prefers-reduced-motion
- Keep animations under 300ms for UI feedback
- Use appropriate easing functions
- Ensure animations don''t block user interaction',
  'ui-ux',
  ARRAY['animation', 'transitions', 'framer-motion', 'ux']
),
(
  'Dark Mode Implementation',
  'Implement dark mode with system preference detection',
  'Implement dark mode for this application:
- Detect system preference using prefers-color-scheme
- Allow manual toggle with localStorage persistence
- Use CSS variables or Tailwind dark: variant
- Ensure proper contrast ratios in both modes
- Smooth transition between modes
- Update all components to support both themes',
  'ui-ux',
  ARRAY['dark-mode', 'theming', 'tailwind', 'accessibility']
),
(
  'Loading States and Skeletons',
  'Create loading skeletons for better perceived performance',
  'Create loading skeleton components for [page/component]:
- Match the layout of the actual content
- Use subtle animation (pulse or shimmer)
- Ensure proper sizing to prevent layout shift
- Include aria-busy and aria-live attributes
- Create reusable skeleton primitives',
  'ui-ux',
  ARRAY['loading', 'skeleton', 'ux', 'performance']
);

-- Insert sample Backend prompts
INSERT INTO prompts (title, description, prompt_text, category, tags) VALUES
(
  'REST API Endpoint',
  'Create a RESTful API endpoint with proper error handling',
  'Create a REST API endpoint for [resource]:
- Method: [GET/POST/PUT/DELETE]
- Route: /api/[path]
- Include input validation using Zod
- Proper error handling with appropriate HTTP status codes
- TypeScript types for request/response
- Add rate limiting if needed
- Include logging for debugging',
  'backend',
  ARRAY['api', 'rest', 'typescript', 'validation']
),
(
  'Database Query Optimization',
  'Optimize database queries for better performance',
  'Help me optimize this database query/operation:
[paste query or describe operation]

Consider:
- Adding appropriate indexes
- Query restructuring for efficiency
- Pagination for large datasets
- Caching strategies
- Connection pooling
- Avoiding N+1 queries',
  'backend',
  ARRAY['database', 'optimization', 'performance', 'sql']
),
(
  'Authentication Flow',
  'Implement secure authentication with Supabase',
  'Implement authentication for this Next.js app using Supabase Auth:
- Email/password sign up and sign in
- OAuth providers: [list providers]
- Protected routes with middleware
- Session management
- Password reset flow
- Email verification
- Proper error handling and user feedback',
  'backend',
  ARRAY['auth', 'supabase', 'security', 'nextjs']
),
(
  'Server Action with Validation',
  'Create a Next.js server action with proper validation',
  'Create a server action for [action description]:
- Use ''use server'' directive
- Validate input with Zod schema
- Handle errors gracefully and return appropriate responses
- Revalidate cache/paths as needed
- Include TypeScript types
- Add optimistic updates on the client if applicable',
  'backend',
  ARRAY['server-actions', 'nextjs', 'validation', 'typescript']
),
(
  'Error Handling Middleware',
  'Set up centralized error handling',
  'Set up centralized error handling for the API:
- Create custom error classes (ValidationError, NotFoundError, etc.)
- Implement error boundary/middleware
- Log errors with appropriate context
- Return user-friendly error messages
- Hide sensitive details in production
- Include request ID for tracing',
  'backend',
  ARRAY['error-handling', 'middleware', 'logging', 'api']
),
(
  'Background Job Processing',
  'Implement background job processing',
  'Set up background job processing for [task description]:
- Choose appropriate solution (Vercel Cron, Inngest, etc.)
- Implement retry logic with exponential backoff
- Add proper error handling and logging
- Include job status tracking
- Handle timeouts appropriately
- Add monitoring/alerting',
  'backend',
  ARRAY['background-jobs', 'cron', 'async', 'queues']
),
(
  'API Rate Limiting',
  'Implement rate limiting for API endpoints',
  'Implement rate limiting for the API:
- Use sliding window or token bucket algorithm
- Configure limits per endpoint/user
- Return proper 429 status with Retry-After header
- Store rate limit data in Redis or similar
- Add bypass for internal services
- Include rate limit headers in responses',
  'backend',
  ARRAY['rate-limiting', 'security', 'api', 'redis']
),
(
  'Data Seeding Script',
  'Create a database seeding script',
  'Create a database seeding script for [environment]:
- Include realistic sample data
- Handle relationships between tables
- Make it idempotent (safe to run multiple times)
- Use transactions for data integrity
- Add option for different data volumes
- Include cleanup function',
  'backend',
  ARRAY['database', 'seeding', 'testing', 'development']
);
