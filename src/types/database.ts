export type Category = 'database' | 'integration' | 'ui-ux' | 'content'

export type PromptLevel = 'junior' | 'mid' | 'senior'

// User types
export interface User {
  id: string
  email: string
  password: string
  full_name?: string
  admin: boolean
  created_at: string
  updated_at: string
}

export interface UserInsert {
  email: string
  password: string
  full_name?: string
  admin?: boolean
}

// Project types
export interface Project {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ProjectInsert {
  name: string
  description?: string
}

// User-Project relationship
export interface UserProject {
  id: string
  user_id: string
  project_id: string
  created_at: string
}

// Prompt types
export interface Prompt {
  id: string
  title: string
  description: string
  prompt_text: string
  category: Category
  subcategory?: string
  tags: string[]
  level?: PromptLevel
  example_context?: string
  created_at: string
  updated_at: string
}

export interface PromptInsert {
  title: string
  description: string
  prompt_text: string
  category: Category
  subcategory?: string
  tags: string[]
  level?: PromptLevel
  example_context?: string
}

export interface PromptUpdate {
  title?: string
  description?: string
  prompt_text?: string
  category?: Category
  subcategory?: string
  tags?: string[]
  level?: PromptLevel
  example_context?: string
}

// User-Project-Prompt relationship
export interface UserProjectPrompt {
  id: string
  user_project_id: string
  prompt_id: string
  created_at: string
}

// Extended types for reports
export interface UserWithStats {
  id: string
  email: string
  full_name?: string
  admin: boolean
  total_prompts: number
  total_projects: number
  created_at: string
}

export interface ProjectWithStats {
  id: string
  name: string
  description?: string
  total_users: number
  total_prompts: number
  created_at: string
}

export interface UserProjectReport {
  user_id: string
  user_email: string
  user_name?: string
  project_id: string
  project_name: string
  prompt_count: number
  last_prompt_at?: string
}

export const categoryConfig: Record<Category, { label: string; description: string; gradient: string; icon: string }> = {
  database: {
    label: 'Database & Schema',
    description: 'Data integrity, migrations, and query optimization',
    gradient: 'from-violet-600 to-purple-600',
    icon: 'database'
  },
  integration: {
    label: 'Integration & Data Flow',
    description: 'XML parsing, APIs, and automation',
    gradient: 'from-blue-500 to-cyan-500',
    icon: 'workflow'
  },
  'ui-ux': {
    label: 'UI/UX Implementation',
    description: 'Components, styling, and state management',
    gradient: 'from-pink-500 to-rose-500',
    icon: 'palette'
  },
  content: {
    label: 'Content & Localization',
    description: 'i18n, SEO, and content generation',
    gradient: 'from-orange-500 to-amber-500',
    icon: 'globe'
  }
}
