'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import type { Project, Prompt, PromptInsert, PromptUpdate } from '@/types/database'

// =====================================================
// USER PROJECTS - Get projects assigned to user
// =====================================================

export async function getMyProjects() {
  const user = await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('user_projects')
    .select(`
      id,
      project_id,
      projects (
        id,
        name,
        description,
        created_at
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

// =====================================================
// USER PROMPTS - Get prompts for a specific project
// =====================================================

export async function getProjectPrompts(projectId: string) {
  const user = await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  // First get the user_project_id
  const { data: userProject, error: upError } = await supabase
    .from('user_projects')
    .select('id')
    .eq('user_id', user.id)
    .eq('project_id', projectId)
    .single()

  if (upError || !userProject) {
    return { success: false, error: 'Project not found or not assigned to you' }
  }

  // Get prompts for this user-project
  const { data: userProjectPrompts, error: uppError } = await supabase
    .from('user_projects_prompts')
    .select(`
      prompt_id,
      prompts (
        id,
        title,
        description,
        prompt_text,
        category,
        subcategory,
        tags,
        level,
        example_context,
        created_at,
        updated_at
      )
    `)
    .eq('user_project_id', userProject.id)

  if (uppError) {
    return { success: false, error: uppError.message }
  }

  const prompts = userProjectPrompts?.map((upp: any) => upp.prompts).filter(Boolean) || []
  return { success: true, data: prompts as Prompt[] }
}

// =====================================================
// CREATE PROMPT - Create a new prompt under a project
// =====================================================

export async function createPromptInProject(projectId: string, promptData: PromptInsert) {
  const user = await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  // First get the user_project_id
  const { data: userProject, error: upError } = await supabase
    .from('user_projects')
    .select('id')
    .eq('user_id', user.id)
    .eq('project_id', projectId)
    .single()

  if (upError || !userProject) {
    return { success: false, error: 'Project not found or not assigned to you' }
  }

  // Create the prompt
  const { data: prompt, error: promptError } = await supabase
    .from('prompts')
    .insert(promptData)
    .select()
    .single()

  if (promptError || !prompt) {
    return { success: false, error: promptError?.message || 'Failed to create prompt' }
  }

  // Link prompt to user_project
  const { error: linkError } = await supabase
    .from('user_projects_prompts')
    .insert({
      user_project_id: userProject.id,
      prompt_id: prompt.id,
    })

  if (linkError) {
    // Rollback: delete the prompt
    await supabase.from('prompts').delete().eq('id', prompt.id)
    return { success: false, error: 'Failed to link prompt to project' }
  }

  return { success: true, data: prompt as Prompt }
}

// =====================================================
// UPDATE PROMPT
// =====================================================

export async function updatePromptInProject(promptId: string, projectId: string, promptData: PromptUpdate) {
  const user = await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  // Verify user has access to this prompt through the project
  const { data: userProject, error: upError } = await supabase
    .from('user_projects')
    .select('id')
    .eq('user_id', user.id)
    .eq('project_id', projectId)
    .single()

  if (upError || !userProject) {
    return { success: false, error: 'Access denied' }
  }

  // Verify the prompt is linked to this user_project
  const { data: link, error: linkError } = await supabase
    .from('user_projects_prompts')
    .select('id')
    .eq('user_project_id', userProject.id)
    .eq('prompt_id', promptId)
    .single()

  if (linkError || !link) {
    return { success: false, error: 'Prompt not found in this project' }
  }

  // Update the prompt
  const { data, error } = await supabase
    .from('prompts')
    .update(promptData)
    .eq('id', promptId)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Prompt }
}

// =====================================================
// DELETE PROMPT
// =====================================================

export async function deletePromptFromProject(promptId: string, projectId: string) {
  const user = await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  // Verify user has access
  const { data: userProject, error: upError } = await supabase
    .from('user_projects')
    .select('id')
    .eq('user_id', user.id)
    .eq('project_id', projectId)
    .single()

  if (upError || !userProject) {
    return { success: false, error: 'Access denied' }
  }

  // Delete the prompt (cascade will handle user_projects_prompts)
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', promptId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
