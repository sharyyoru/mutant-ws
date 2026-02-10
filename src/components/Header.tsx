'use client'

import { useState, useEffect } from 'react'
import { Wind, Moon, Sun, Github, Sparkles } from 'lucide-react'

export default function Header() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDarkMode(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleDarkMode = () => {
    const newValue = !darkMode
    setDarkMode(newValue)
    localStorage.setItem('darkMode', String(newValue))
    document.documentElement.classList.toggle('dark', newValue)
  }

  return (
    <header className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500" />
      
      {/* Decorative Blobs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-400/30 rounded-full blur-3xl" />
      
      {/* Navigation Bar */}
      <nav className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Windsurf</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/sharyyoru/mutant-ws"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                aria-label="GitHub repository"
              >
                <Github className="w-5 h-5" />
              </a>
              <button
                onClick={toggleDarkMode}
                className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Windsurf Functional Prompt Library
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Master Windsurf with
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-yellow-200">
              Expert Prompts
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            A curated collection of prompt templates for Database, Integration, UI/UX, and Content workflows. 
            From schema design to SEO optimization.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
              <span className="w-2 h-2 bg-violet-300 rounded-full" />
              Database & Schema
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
              <span className="w-2 h-2 bg-blue-300 rounded-full" />
              Integration & Data Flow
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
              <span className="w-2 h-2 bg-pink-300 rounded-full" />
              UI/UX Implementation
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white">
              <span className="w-2 h-2 bg-orange-300 rounded-full" />
              Content & Localization
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="relative z-10">
        <svg className="w-full h-16 md:h-24" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            fill="currentColor" 
            className="text-gray-50 dark:text-gray-950"
            d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"
          />
        </svg>
      </div>
    </header>
  )
}
