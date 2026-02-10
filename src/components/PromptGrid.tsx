'use client'

import { useState } from 'react'
import { Plus, Search, Database, Workflow, Palette, Globe } from 'lucide-react'
import PromptCard from './PromptCard'
import PromptForm from './PromptForm'
import type { Prompt, Category } from '@/types/database'
import { categoryConfig } from '@/types/database'

interface PromptGridProps {
  initialPrompts: Prompt[]
  projectId?: string
}

const categoryIcons: Record<Category, React.ReactNode> = {
  database: <Database className="w-5 h-5" />,
  integration: <Workflow className="w-5 h-5" />,
  'ui-ux': <Palette className="w-5 h-5" />,
  content: <Globe className="w-5 h-5" />,
}

export default function PromptGrid({ initialPrompts, projectId }: PromptGridProps) {
  const [prompts] = useState<Prompt[]>(initialPrompts)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>()

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesCategory = activeCategory === 'all' || prompt.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const categories: Category[] = ['database', 'integration', 'ui-ux', 'content']

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPrompt(undefined)
  }

  const getPromptsByCategory = (category: Category) => 
    filteredPrompts.filter(p => p.category === category)

  return (
    <div className="space-y-12">
      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search prompts by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>
          
          {/* Add Button */}
          <button 
            onClick={() => setShowForm(true)} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 hover:shadow-lg transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Prompt
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              activeCategory === 'all'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All Prompts ({prompts.length})
          </button>
          
          {categories.map((cat) => {
            const config = categoryConfig[cat]
            const count = prompts.filter(p => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  activeCategory === cat
                    ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {categoryIcons[cat]}
                {config.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Sections */}
      {categories.map((category) => {
        const categoryPrompts = getPromptsByCategory(category)
        if (categoryPrompts.length === 0) return null
        if (activeCategory !== 'all' && activeCategory !== category) return null
        
        const config = categoryConfig[category]
        
        return (
          <section key={category}>
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${config.gradient} text-white shadow-lg`}>
                {categoryIcons[category]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {config.label}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {config.description}
                </p>
              </div>
              <div className="ml-auto">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium">
                  {categoryPrompts.length} prompts
                </span>
              </div>
            </div>
            
            {/* Prompt Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categoryPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} onEdit={handleEdit} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
            <Search className="w-8 h-8 text-violet-600 dark:text-violet-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No prompts found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? `No results for "${searchQuery}". Try a different search term.`
              : 'Add your first prompt to get started!'}
          </p>
          <button 
            onClick={() => setShowForm(true)} 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Prompt
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <PromptForm
          prompt={editingPrompt}
          onClose={handleCloseForm}
          projectId={projectId}
        />
      )}
    </div>
  )
}
