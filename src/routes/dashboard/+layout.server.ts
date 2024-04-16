import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {

  // Redirect to login if no session
  let data = await safeGetSession();

  if (!data.session) {
    return redirect(302, '/login')
  }

  // Else load the projects for the user
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', data.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects', error)
    return {
      projects: []
    }
  }

  return {
    projects: projects
  }
}