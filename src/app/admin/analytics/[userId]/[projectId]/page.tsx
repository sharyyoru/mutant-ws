'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { getUserProjectAnalytics } from '@/lib/admin-actions'

interface PromptData {
  id: string
  prompt_id: string
  created_at: string
  prompts: {
    id: string
    title: string
    category: string
    level: string
    created_at: string
  }
}

interface AnalyticsData {
  prompts: PromptData[]
  user: any
  project: any
  userProjectId: string
}

export default function UserProjectAnalyticsPage({ 
  params 
}: { 
  params: Promise<{ userId: string; projectId: string }> 
}) {
  const { userId, projectId } = use(params)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [userId, projectId])

  const loadData = async () => {
    setLoading(true)
    const result = await getUserProjectAnalytics(userId, projectId)

    if (result.success && result.data) {
      setData(result.data as AnalyticsData)
    } else {
      setError(result.error || 'Failed to load analytics')
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading analytics...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">{error || 'No data found'}</p>
        <Link href={`/admin/users/${userId}`} className="mt-4 inline-block text-violet-600 hover:text-violet-700">
          ← Back to User
        </Link>
      </div>
    )
  }

  // Process data for charts
  const promptsByDay = data.prompts.reduce((acc: any, prompt) => {
    const date = new Date(prompt.created_at).toLocaleDateString()
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const promptsByCategory = data.prompts.reduce((acc: any, prompt) => {
    const category = prompt.prompts.category
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {})

  const promptsByLevel = data.prompts.reduce((acc: any, prompt) => {
    const level = prompt.prompts.level
    acc[level] = (acc[level] || 0) + 1
    return acc
  }, {})

  const dates = Object.keys(promptsByDay).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  )
  const maxCount = Math.max(...Object.values(promptsByDay).map(v => v as number), 1)

  const categories = Object.entries(promptsByCategory)
  const levels = Object.entries(promptsByLevel)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href={`/admin/users/${userId}`} className="text-violet-600 hover:text-violet-700 text-sm font-medium mb-4 inline-block">
          ← Back to User
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {data.user?.full_name || data.user?.email} • {data.project?.name}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Prompts</p>
          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{data.prompts.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories Used</p>
          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg per Day</p>
          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            {dates.length > 0 ? (data.prompts.length / dates.length).toFixed(1) : 0}
          </p>
        </div>
      </div>

      {/* Prompts Per Day Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Prompts Created Per Day</h2>
        {dates.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">No data available</p>
        ) : (
          <div className="space-y-3">
            {dates.map((date) => {
              const count = promptsByDay[date]
              const percentage = (count / maxCount) * 100
              return (
                <div key={date} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
                    {date}
                  </div>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="absolute inset-0 flex items-center px-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white z-10">
                        {count} prompt{count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">By Category</h2>
          {categories.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-4">
              {categories.map(([category, count]) => {
                const percentage = ((count as number) / data.prompts.length) * 100
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{category}</span>
                      <span className="text-gray-600 dark:text-gray-400">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-violet-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">By Level</h2>
          {levels.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-4">
              {levels.map(([level, count]) => {
                const percentage = ((count as number) / data.prompts.length) * 100
                return (
                  <div key={level}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{level}</span>
                      <span className="text-gray-600 dark:text-gray-400">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Prompts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Prompts</h2>
        {data.prompts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">No prompts created yet</p>
        ) : (
          <div className="space-y-3">
            {data.prompts.slice(-10).reverse().map((prompt) => (
              <div key={prompt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{prompt.prompts.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {prompt.prompts.category} • {prompt.prompts.level}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(prompt.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
