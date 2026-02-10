import { use } from 'react'
import { getUserProjectReport } from '@/lib/admin-actions'
import Link from 'next/link'

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params
  const result = await getUserProjectReport(userId)
  
  if (!result.success || !result.data || result.data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No data found for this user</p>
        <Link href="/admin/users" className="mt-4 inline-block text-violet-600 hover:text-violet-700">
          ← Back to Users
        </Link>
      </div>
    )
  }

  const reports = result.data
  const userInfo = reports[0]
  const totalPrompts = reports.reduce((sum, r) => sum + r.prompt_count, 0)

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users" className="text-violet-600 hover:text-violet-700 text-sm font-medium mb-4 inline-block">
          ← Back to Users
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userInfo.user_name || userInfo.user_email}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{userInfo.user_email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{reports.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Prompts</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalPrompts}</p>
        </div>
      </div>

      {/* Project Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projects & Prompts</h2>
        </div>
        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">No projects assigned yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {reports.map((report) => (
              <Link 
                key={report.project_id} 
                href={`/admin/analytics/${userId}/${report.project_id}`}
                className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{report.project_name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      Last activity: {new Date(report.last_prompt_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{report.prompt_count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">prompts</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
