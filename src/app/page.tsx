import Header from '@/components/Header'
import PromptGrid from '@/components/PromptGrid'
import { getPrompts } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const prompts = await getPrompts()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PromptGrid initialPrompts={prompts} />
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
