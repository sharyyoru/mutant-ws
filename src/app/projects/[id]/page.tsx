import { getProjectPrompts, getMyProjects } from '@/lib/user-actions'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import PromptGrid from '@/components/PromptGrid'
import Link from 'next/link'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // Verify user has access to this project
  const projectsResult = await getMyProjects()
  const myProjects = projectsResult.success && projectsResult.data ? projectsResult.data : []
  const hasAccess = myProjects.some((item: any) => item.project_id === projectId)

  if (!hasAccess) {
    redirect('/')
  }

  const project = myProjects.find((item: any) => item.project_id === projectId)
  const projectInfo = project?.projects

  // Get prompts for this project
  const promptsResult = await getProjectPrompts(projectId)
  const prompts = promptsResult.success ? promptsResult.data : []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-violet-600 hover:text-violet-700 text-sm font-medium mb-2 inline-block">
                ← Back to Projects
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{projectInfo?.name}</h1>
              {projectInfo?.description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">{projectInfo.description}</p>
              )}
            </div>
            <div className="text-right flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                <div className="flex items-center gap-3 justify-end mt-1">
                  <Link href="/settings" className="text-sm font-medium text-violet-600 hover:text-violet-700">
                    Settings
                  </Link>
                  <span className="text-gray-300">•</span>
                  <form action={async () => {
                    'use server'
                    const { signOut } = await import('@/lib/auth')
                    await signOut()
                    redirect('/login')
                  }} className="inline">
                    <button type="submit" className="text-sm font-medium text-violet-600 hover:text-violet-700">
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PromptGrid initialPrompts={prompts || []} projectId={projectId} />
    </main>
  )
}
