'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProjectById, getProjectUsers, getAllUsers, assignUserToProject, removeUserFromProject, updateProject } from '@/lib/admin-actions'

interface User {
  id: string
  email: string
  full_name?: string
  admin: boolean
}

interface ProjectUser {
  id: string
  user_id: string
  created_at: string
  users: User
}

interface Project {
  id: string
  name: string
  description?: string
  created_at: string
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [assignedUsers, setAssignedUsers] = useState<ProjectUser[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [projectId])

  const loadData = async () => {
    setLoading(true)
    setError('')

    const [projectResult, usersResult, allUsersResult] = await Promise.all([
      getProjectById(projectId),
      getProjectUsers(projectId),
      getAllUsers(),
    ])

    if (projectResult.success && projectResult.data) {
      setProject(projectResult.data)
      setEditName(projectResult.data.name)
      setEditDescription(projectResult.data.description || '')
    } else {
      setError('Failed to load project')
    }

    if (usersResult.success && usersResult.data) {
      setAssignedUsers(usersResult.data as any)
    }

    if (allUsersResult.success && allUsersResult.data) {
      setAllUsers(allUsersResult.data)
    }

    setLoading(false)
  }

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const result = await updateProject(projectId, {
      name: editName,
      description: editDescription || undefined,
    })

    if (result.success) {
      setShowEditForm(false)
      loadData()
    } else {
      setError(result.error || 'Failed to update project')
    }
  }

  const handleAssignUser = async (userId: string) => {
    setError('')
    const result = await assignUserToProject(userId, projectId)

    if (result.success) {
      setShowAssignModal(false)
      loadData()
    } else {
      setError(result.error || 'Failed to assign user')
    }
  }

  const handleRemoveUser = async (userId: string) => {
    if (!confirm('Remove this user from the project?')) return

    setError('')
    const result = await removeUserFromProject(userId, projectId)

    if (result.success) {
      loadData()
    } else {
      setError(result.error || 'Failed to remove user')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Project not found</p>
        <Link href="/admin/projects" className="mt-4 inline-block text-violet-600 hover:text-violet-700">
          ← Back to Projects
        </Link>
      </div>
    )
  }

  const assignedUserIds = assignedUsers.map(u => u.user_id)
  const availableUsers = allUsers.filter(u => !assignedUserIds.includes(u.id) && !u.admin)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/admin/projects" className="text-violet-600 hover:text-violet-700 text-sm font-medium mb-4 inline-block">
          ← Back to Projects
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            {project.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">{project.description}</p>
            )}
          </div>
          <button
            onClick={() => setShowEditForm(true)}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
          >
            Edit Project
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Users</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{assignedUsers.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</p>
          <p className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Assigned Users */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assigned Users</h2>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              + Assign User
            </button>
          </div>
        </div>
        {assignedUsers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No users assigned to this project yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {assignedUsers.map((item: any) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.users.full_name || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.users.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Assigned: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center px-4">
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                      {item.prompt_count || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">prompts</p>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(item.user_id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Project</h3>
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign User Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Assign User to Project</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            {availableUsers.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                All users are already assigned to this project
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAssignUser(user.id)}
                    className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.full_name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
