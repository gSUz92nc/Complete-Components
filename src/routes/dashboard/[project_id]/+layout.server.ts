import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
  // Load the components for the project
  const { data: components, error } = await supabase
    .from('components')
    .select('*')
    .eq('project_id', project_id)
    .order('created_at', { ascending: false })
}