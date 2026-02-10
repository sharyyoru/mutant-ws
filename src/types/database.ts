export type Category = 'database' | 'integration' | 'ui-ux' | 'content'

export type PromptLevel = 'mid' | 'expert'

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
