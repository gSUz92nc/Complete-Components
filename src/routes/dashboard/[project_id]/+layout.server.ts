import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, params }) => {

  const project_id = params.project_id

  // Load the components for the project
  const { data, error } = await supabase
    .from('components')
    .select('*')
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching components', error)
    return {
      components: []
    }
  }

  return {
    components: data
  }
}