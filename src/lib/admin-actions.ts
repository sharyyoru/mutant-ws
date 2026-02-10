'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import type { User, UserInsert, Project, ProjectInsert, UserWithStats, UserProjectReport } from '@/types/database'

// =====================================================
// USER MANAGEMENT
// =====================================================

export async function getAllUsers() {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as User[] }
}

export async function createUser(userData: UserInsert) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as User }
}

export async function deleteUser(userId: string) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

// =====================================================
// PROJECT MANAGEMENT
// =====================================================

export async function getAllProjects() {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Project[] }
}

export async function createProject(projectData: ProjectInsert) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Project }
}

export async function updateProject(projectId: string, projectData: Partial<ProjectInsert>) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectId)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Project }
}

export async function deleteProject(projectId: string) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getProjectById(projectId: string) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Project }
}

// =====================================================
// USER-PROJECT ASSIGNMENTS
// =====================================================

export async function assignUserToProject(userId: string, projectId: string) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('user_projects')
    .insert({ user_id: userId, project_id: projectId })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function removeUserFromProject(userId: string, projectId: string) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { error } = await supabase
    .from('user_projects')
    .delete()
    .eq('user_id', userId)
    .eq('project_id', projectId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function getUserProjects(userId: string) {
  await requireAdmin()
  
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
        description
      )
    `)
    .eq('user_id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getProjectUsers(projectId: string) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  const { data, error } = await supabase
    .from('user_projects')
    .select(`
      id,
      user_id,
      created_at,
      users (
        id,
        email,
        full_name,
        admin
      )
    `)
    .eq('project_id', projectId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Get prompt counts for each user in this project
  if (data) {
    const usersWithCounts = await Promise.all(
      data.map(async (userProject: any) => {
        const { count } = await supabase
          .from('user_projects_prompts')
          .select('*', { count: 'exact', head: true })
          .eq('user_project_id', userProject.id)

        return {
          ...userProject,
          prompt_count: count || 0
        }
      })
    )
    return { success: true, data: usersWithCounts }
  }

  return { success: true, data }
}

export async function getUserProjectReport(userId: string) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  // Get user info
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, full_name')
    .eq('id', userId)
    .single()

  if (userError || !user) {
    return { success: false, error: 'User not found' }
  }

  // Get all user_projects for this user
  const { data, error } = await supabase
    .from('user_projects')
    .select(`
      id,
      project_id,
      created_at,
      projects (
        id,
        name,
        description
      )
    `)
    .eq('user_id', userId)

  if (error) {
    return { success: false, error: error.message }
  }

  // Get prompt counts and last activity for each project
  if (data) {
    const projectsWithCounts = await Promise.all(
      data.map(async (userProject: any) => {
        const { data: prompts } = await supabase
          .from('user_projects_prompts')
          .select('created_at')
          .eq('user_project_id', userProject.id)
          .order('created_at', { ascending: false })
          .limit(1)

        const { count } = await supabase
          .from('user_projects_prompts')
          .select('*', { count: 'exact', head: true })
          .eq('user_project_id', userProject.id)

        return {
          user_id: user.id,
          user_email: user.email,
          user_name: user.full_name,
          project_id: userProject.project_id,
          project_name: userProject.projects.name,
          project_description: userProject.projects.description,
          prompt_count: count || 0,
          last_prompt_at: prompts?.[0]?.created_at || userProject.created_at
        }
      })
    )
    return { success: true, data: projectsWithCounts }
  }

  return { success: true, data: [] }
}

export async function getUserProjectAnalytics(userId: string, projectId: string) {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  // Get the user_project relationship
  const { data: userProject, error: upError } = await supabase
    .from('user_projects')
    .select('id')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .single()

  if (upError || !userProject) {
    return { success: false, error: 'User project not found' }
  }

  // Get all prompts for this user-project with full details
  const { data: prompts, error: promptsError } = await supabase
    .from('user_projects_prompts')
    .select(`
      id,
      prompt_id,
      created_at,
      prompts (
        id,
        title,
        category,
        level,
        created_at
      )
    `)
    .eq('user_project_id', userProject.id)
    .order('created_at', { ascending: true })

  if (promptsError) {
    return { success: false, error: promptsError.message }
  }

  // Get user and project details
  const [userResult, projectResult] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('projects').select('*').eq('id', projectId).single()
  ])

  return { 
    success: true, 
    data: {
      prompts: prompts || [],
      user: userResult.data,
      project: projectResult.data,
      userProjectId: userProject.id
    }
  }
}

// =====================================================
// REPORTS & STATISTICS
// =====================================================

export async function getUserStats() {
  await requireAdmin()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  // Get users with their project and prompt counts
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, full_name, admin, created_at')
    .order('created_at', { ascending: false })

  if (usersError || !users) {
    return { success: false, error: usersError?.message || 'Failed to fetch users' }
  }

  const usersWithStats: UserWithStats[] = await Promise.all(
    users.map(async (user) => {
      // Get project count
      const { data: projects } = await supabase
        .from('user_projects')
        .select('id')
        .eq('user_id', user.id)

      // Get prompt count through user_projects_prompts
      const { data: userProjects } = await supabase
        .from('user_projects')
        .select('id')
        .eq('user_id', user.id)

      let totalPrompts = 0
      if (userProjects) {
        for (const up of userProjects) {
          const { data: prompts } = await supabase
            .from('user_projects_prompts')
            .select('id')
            .eq('user_project_id', up.id)
          totalPrompts += prompts?.length || 0
        }
      }

      return {
        ...user,
        total_projects: projects?.length || 0,
        total_prompts: totalPrompts,
      }
    })
  )

  return { success: true, data: usersWithStats }
}
