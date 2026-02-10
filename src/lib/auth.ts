'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import type { User } from '@/types/database'

const SESSION_COOKIE = 'user_session'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionData = cookieStore.get(SESSION_COOKIE)?.value
    
    if (!sessionData) {
      return null
    }

    const userId = JSON.parse(sessionData).userId
    const supabase = await createClient()
    
    if (!supabase) {
      return null
    }
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return null
    }

    return data as User
  } catch (error) {
    return null
  }
}

export async function signIn(email: string, password: string) {
  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return { success: false, error: 'Database not configured' }
    }
    
    // Get user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { success: false, error: 'Invalid email or password' }
    }

    // In production, you should use bcrypt to compare passwords
    // For now, simple comparison (you'll need to implement proper hashing)
    if (user.password !== password) {
      return { success: false, error: 'Invalid email or password' }
    }

    // Create session
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, JSON.stringify({ userId: user.id }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return { success: true, user }
  } catch (error) {
    console.error('Sign in error:', error)
    return { success: false, error: 'Failed to sign in' }
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  return { success: true }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (!user.admin) {
    throw new Error('Admin access required')
  }
  return user
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const user = await requireAuth()
  
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: 'Database not configured' }
  }

  // Verify current password
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('password')
    .eq('id', user.id)
    .single()

  if (fetchError || !userData) {
    return { success: false, error: 'Failed to verify password' }
  }

  if (userData.password !== currentPassword) {
    return { success: false, error: 'Current password is incorrect' }
  }

  // Update to new password
  const { error: updateError } = await supabase
    .from('users')
    .update({ password: newPassword })
    .eq('id', user.id)

  if (updateError) {
    return { success: false, error: 'Failed to update password' }
  }

  return { success: true }
}
