# Windsurf Prompt Cheatsheet

A collaborative prompt library to help your team use Windsurf more effectively for UI/UX and Backend development.

## Features

- **Two Sections**: Separate UI/UX and Backend prompt categories
- **Search & Filter**: Quickly find prompts by title, description, or tags
- **Copy to Clipboard**: One-click copy for easy use
- **CRUD Operations**: Add, edit, and delete prompts
- **Dark Mode**: System-aware with manual toggle
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/sharyyoru/mutant-ws.git
cd mutant-ws
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your project URL and anon key from Settings > API

### 3. Configure environment variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deploy to Vercel

1. Push to your GitHub repository
2. Import the project in Vercel
3. Add the environment variables in Vercel's project settings
4. Deploy!

## Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main page with prompt grid
│   └── globals.css     # Global styles
├── components/
│   ├── Header.tsx      # Navigation header
│   ├── PromptCard.tsx  # Individual prompt display
│   ├── PromptForm.tsx  # Add/edit prompt modal
│   ├── PromptGrid.tsx  # Main grid with filtering
│   └── ui/             # Reusable UI components
├── lib/
│   ├── actions.ts      # Server actions for CRUD
│   └── supabase/       # Supabase client setup
└── types/
    └── database.ts     # TypeScript types
```

## Contributing

Add new prompts that help the team work better with Windsurf!
