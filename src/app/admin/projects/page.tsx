import Link from 'next/link'
import { getAllProjects } from '@/lib/admin-actions'

export default async function ProjectsPage() {
  const result = await getAllProjects()
  const projects = result.success ? result.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects Management</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage all projects</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
        >
          Create Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {project.description}
              </p>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
              <Link 
                href={`/admin/projects/${project.id}`}
                className="text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
              >
                Manage →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
