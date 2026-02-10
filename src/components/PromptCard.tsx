'use client'

import { useState } from 'react'
import { Copy, Check, Trash2, Edit2, Lightbulb, Zap } from 'lucide-react'
import type { Prompt } from '@/types/database'
import { deletePrompt } from '@/lib/actions'
import { categoryConfig } from '@/types/database'

interface PromptCardProps {
  prompt: Prompt
  onEdit?: (prompt: Prompt) => void
}

export default function PromptCard({ prompt, onEdit }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.prompt_text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prompt?')) return
    
    setIsDeleting(true)
    const result = await deletePrompt(prompt.id)
    if (!result.success) {
      alert('Failed to delete prompt: ' + result.error)
    }
    setIsDeleting(false)
  }

  const config = categoryConfig[prompt.category]

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {prompt.level === 'expert' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full">
                  <Zap className="w-3 h-3" />
                  Expert
                </span>
              )}
              {prompt.subcategory && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {prompt.subcategory}
                </span>
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {prompt.title}
            </h3>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(prompt)}
                className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors"
                aria-label="Edit prompt"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
              aria-label="Delete prompt"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {prompt.description}
        </p>
        
        {/* Prompt text box */}
        <div 
          className={`relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl p-4 mb-4 cursor-pointer transition-all ${isExpanded ? '' : 'max-h-32 overflow-hidden'}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {prompt.prompt_text}
          </pre>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-100 dark:from-gray-800 to-transparent flex items-end justify-center pb-2">
              <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">Click to expand</span>
            </div>
          )}
        </div>

        {/* Context hint */}
        {prompt.example_context && (
          <div className="flex items-start gap-2 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl mb-4">
            <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400 mt-0.5 shrink-0" />
            <p className="text-xs text-violet-700 dark:text-violet-300">
              {prompt.example_context}
            </p>
          </div>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {prompt.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            copied 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : `bg-gradient-to-r ${config.gradient} text-white hover:opacity-90 hover:shadow-lg`
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied to clipboard!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Prompt
            </>
          )}
        </button>
      </div>
    </div>
  )
}
