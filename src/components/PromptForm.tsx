'use client'

import { useState } from 'react'
import { X, Database, Workflow, Palette, Globe } from 'lucide-react'
import type { Prompt, PromptInsert, Category, PromptLevel } from '@/types/database'
import { createPrompt, updatePrompt } from '@/lib/actions'
import { createPromptInProject, updatePromptInProject } from '@/lib/user-actions'
import { categoryConfig } from '@/types/database'

interface PromptFormProps {
  prompt?: Prompt
  onClose: () => void
  projectId?: string
}

const categoryIcons: Record<Category, React.ReactNode> = {
  database: <Database className="w-4 h-4" />,
  integration: <Workflow className="w-4 h-4" />,
  'ui-ux': <Palette className="w-4 h-4" />,
  content: <Globe className="w-4 h-4" />,
}

export default function PromptForm({ prompt, onClose, projectId }: PromptFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: prompt?.title || '',
    description: prompt?.description || '',
    prompt_text: prompt?.prompt_text || '',
    category: prompt?.category || 'database' as Category,
    subcategory: prompt?.subcategory || '',
    tags: prompt?.tags.join(', ') || '',
    level: prompt?.level || 'mid' as PromptLevel,
    example_context: prompt?.example_context || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const data: PromptInsert = {
      title: formData.title,
      description: formData.description,
      prompt_text: formData.prompt_text,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      level: formData.level,
      example_context: formData.example_context || undefined,
    }

    let result
    if (projectId) {
      // User is creating/editing within a project
      if (prompt) {
        result = await updatePromptInProject(prompt.id, projectId, data)
      } else {
        result = await createPromptInProject(projectId, data)
      }
    } else {
      // Admin or general prompt management
      if (prompt) {
        result = await updatePrompt(prompt.id, data)
      } else {
        result = await createPrompt(data)
      }
    }

    setIsSubmitting(false)

    if (result.success) {
      onClose()
      window.location.reload()
    } else {
      alert('Error: ' + result.error)
    }
  }

  const categories: Category[] = ['database', 'integration', 'ui-ux', 'content']

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {prompt ? 'Edit Prompt' : 'Add New Prompt'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create a prompt template for your team
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="e.g., Schema Generation"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="Brief description of what this prompt does"
            />
          </div>

          {/* Category & Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const config = categoryConfig[cat]
                  const isSelected = formData.category === cat
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? `border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300`
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {categoryIcons[cat]}
                      <span className="truncate">{config.label.split(' ')[0]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prompt Level
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, level: 'junior' })}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.level === 'junior'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  Junior
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, level: 'mid' })}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.level === 'mid'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  Mid-Level
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, level: 'senior' })}
                  className={`flex-1 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.level === 'senior'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  Senior
                </button>
              </div>
            </div>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subcategory
            </label>
            <input
              type="text"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="e.g., Schema Generation, Pro-Tips, Refactoring"
            />
          </div>

          {/* Prompt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prompt Text *
            </label>
            <textarea
              required
              rows={6}
              value={formData.prompt_text}
              onChange={(e) => setFormData({ ...formData, prompt_text: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent font-mono text-sm transition-all"
              placeholder="Enter the prompt template text..."
            />
          </div>

          {/* Context Hint */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Context Hint
            </label>
            <input
              type="text"
              value={formData.example_context}
              onChange={(e) => setFormData({ ...formData, example_context: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="When to use this prompt (shown as a tip)"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              placeholder="e.g., migration, schema, postgresql"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : prompt ? 'Update Prompt' : 'Add Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
