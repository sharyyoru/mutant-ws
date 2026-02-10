import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getMyProjects } from '@/lib/user-actions'
import Link from 'next/link'
import Header from '@/components/Header'
import PromptGrid from '@/components/PromptGrid'
import { getPrompts } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  // Redirect admins to admin portal
  if (user.admin) {
    redirect('/admin')
  }

  // Get user's projects
  const result = await getMyProjects()
  const projects = result.success && result.data ? result.data : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Projects</h1>
            <p className="text-gray-600 dark:text-gray-400">Select a project to manage your prompts</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/settings"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Settings
            </Link>
            <button
              onClick={async () => {
                'use server'
                const { signOut } = await import('@/lib/auth')
                await signOut()
                redirect('/login')
              }}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
            <p className="text-xl text-white">No projects assigned yet</p>
            <p className="mt-2 text-purple-100">Contact your administrator to get access to projects</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((item: any) => {
              const project = item.projects
              return (
                <Link
                  key={item.id}
                  href={`/projects/${project.id}`}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center text-violet-600 dark:text-violet-400 font-medium">
                    Open Project
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to master Windsurf?
            </h3>
            <p className="text-white/80 max-w-2xl mx-auto mb-6">
              Use these expert prompts to supercharge your development workflow. 
              From database design to UI implementation, we&apos;ve got you covered.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
              <span>Database & Schema</span>
              <span>•</span>
              <span>Integration & Data Flow</span>
              <span>•</span>
              <span>UI/UX Implementation</span>
              <span>•</span>
              <span>Content & Localization</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-white/60">
              Windsurf Prompt Cheatsheet — Empowering your team to build better with AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
