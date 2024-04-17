import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ locals: { supabase }, params }) => {

  const id = params.component_id;

  if (!id) {
    return redirect(302, "/dashboard");
  }

  const { data: component, error: componentError } = await supabase.from("components").select("*").eq("id", id).single();

  if (componentError) {
    console.error("Error fetching components", componentError);
    throw redirect(302, "/dashboard");
  }

  return {
    component,
  };
};
