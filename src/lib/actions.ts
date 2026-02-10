'use server'

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Prompt, PromptInsert, PromptUpdate, Category } from '@/types/database'
import { samplePrompts } from './sampleData'

export async function getPrompts(category?: Category): Promise<Prompt[]> {
  if (!isSupabaseConfigured()) {
    const prompts = category 
      ? samplePrompts.filter(p => p.category === category)
      : samplePrompts
    return prompts
  }

  const supabase = await createClient()
  if (!supabase) return samplePrompts
  
  let query = supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching prompts:', error)
    return samplePrompts
  }
  
  return data as Prompt[]
}

export async function getPromptById(id: string): Promise<Prompt | null> {
  if (!isSupabaseConfigured()) {
    return samplePrompts.find(p => p.id === id) || null
  }

  const supabase = await createClient()
  if (!supabase) return samplePrompts.find(p => p.id === id) || null
  
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching prompt:', error)
    return null
  }
  
  return data as Prompt
}

export async function createPrompt(prompt: PromptInsert): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured. Please set up environment variables.' }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Failed to create Supabase client.' }
  }
  
  const { error } = await supabase
    .from('prompts')
    .insert(prompt)
  
  if (error) {
    console.error('Error creating prompt:', error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/')
  return { success: true }
}

export async function updatePrompt(id: string, prompt: PromptUpdate): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured. Please set up environment variables.' }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Failed to create Supabase client.' }
  }
  
  const { error } = await supabase
    .from('prompts')
    .update(prompt)
    .eq('id', id)
  
  if (error) {
    console.error('Error updating prompt:', error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/')
  return { success: true }
}

export async function deletePrompt(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured. Please set up environment variables.' }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Failed to create Supabase client.' }
  }
  
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting prompt:', error)
    return { success: false, error: error.message }
  }
  
  revalidatePath('/')
  return { success: true }
}

export async function searchPrompts(query: string, category?: Category): Promise<Prompt[]> {
  if (!isSupabaseConfigured()) {
    const lowerQuery = query.toLowerCase()
    return samplePrompts.filter(p => {
      const matchesCategory = !category || p.category === category
      const matchesQuery = 
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.prompt_text.toLowerCase().includes(lowerQuery)
      return matchesCategory && matchesQuery
    })
  }

  const supabase = await createClient()
  if (!supabase) return samplePrompts
  
  let dbQuery = supabase
    .from('prompts')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,prompt_text.ilike.%${query}%`)
    .order('created_at', { ascending: false })
  
  if (category) {
    dbQuery = dbQuery.eq('category', category)
  }
  
  const { data, error } = await dbQuery
  
  if (error) {
    console.error('Error searching prompts:', error)
    return samplePrompts
  }
  
  return data as Prompt[]
}
