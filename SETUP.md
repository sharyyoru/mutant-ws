# Setup Instructions - Windsurf Prompts System

## Step 1: Run Database Migration

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/fjhoqnlgmkvbcoqnwohj/sql
2. Copy **ALL** content from `supabase/migration.sql`
3. Paste into SQL Editor
4. Click **RUN**

This creates:
- `users` table (with admin boolean column)
- `projects` table
- `user_projects` table (many-to-many)
- `prompts` table
- `user_projects_prompts` table (links prompts to user-project assignments)
- Admin user: production@mutant.ae with password: Admin@12345
- 3 sample projects

## Step 2: Test Login

1. Start dev server: `npm run dev`
2. Go to: http://localhost:3000
3. Login with:
   - **Email**: production@mutant.ae
   - **Password**: Admin@12345

## Step 3: Admin Portal Features

As admin, you can:

### Users Management
- **Create users**: Set email, password, name, and admin status
- **View all users**: See their projects and prompt counts
- **View user details**: See per-project statistics

### Projects Management
- **Create projects**: Add new projects with name and description
- **View all projects**: See all available projects
- **Assign users to projects**: Link users to specific projects

### Reports
- Dashboard with total users, projects, and prompts
- Per-user statistics showing prompts per project
- Visual reports like in the screenshot you provided

## Step 4: Create Regular Users

1. Go to **Admin Portal** → **Users** → **Create User**
2. Fill in:
   - Email: user@example.com
   - Password: password123
   - Full Name: Test User
   - Admin: **Uncheck** (for regular users)
3. Click **Create User**

## Step 5: Assign Users to Projects

Currently done via SQL (can add UI later):

```sql
-- Get user and project IDs
SELECT id, email FROM public.users;
SELECT id, name FROM public.projects;

-- Assign user to project
INSERT INTO public.user_projects (user_id, project_id)
VALUES ('user-id-here', 'project-id-here');
```

## Step 6: Test User Flow

1. Sign out from admin
2. Login as regular user
3. You'll see **My Projects** page
4. Click on a project
5. Create prompts within that project

## Database Schema

```
users
├── id (UUID)
├── email (TEXT)
├── password (TEXT)
├── full_name (TEXT)
└── admin (BOOLEAN) ← 0 = user, 1 = admin

projects
├── id (UUID)
├── name (TEXT)
└── description (TEXT)

user_projects (many-to-many)
├── id (UUID)
├── user_id → users.id
└── project_id → projects.id

prompts
├── id (UUID)
├── title (TEXT)
├── prompt_text (TEXT)
├── category (TEXT)
└── ... (other fields)

user_projects_prompts
├── id (UUID)
├── user_project_id → user_projects.id
└── prompt_id → prompts.id
```

## Features Implemented

✅ Admin portal with user/project management
✅ User dashboard with project selection
✅ Project-scoped prompt creation
✅ Statistics and reports per user/project
✅ Role-based access (admin boolean)
✅ Clean authentication system
✅ Many-to-many user-project relationships
✅ Prompts linked to specific user-project assignments

## Default Credentials

**Admin**:
- Email: production@mutant.ae
- Password: Admin@12345

**Note**: Change this password in production!

## Architecture

- **Admin users** (admin=true): Access `/admin` portal
- **Regular users** (admin=false): Access `/` (project selection) → `/projects/[id]` (create prompts)
- **Authentication**: Cookie-based sessions
- **Database**: Supabase PostgreSQL
- **Framework**: Next.js 16 with App Router

Done! The system is ready to use. 🚀
