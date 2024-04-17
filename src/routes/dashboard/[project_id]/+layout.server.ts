import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({
  locals: { supabase },
  params,
}) => {
  const project_id = params.project_id;

  try {
    const [componentsResult, projectResult] = await Promise.all([
      await supabase
        .from("components")
        .select("*")
        .eq("project_id", project_id)
        .order("created_at", { ascending: false }),

      await supabase
        .from("projects")
        .select("name")
        .eq("id", project_id)
        .single(),
    ]);

    const { data: components, error: componentsError } = componentsResult;
    const { data: project, error: projectError } = projectResult;

    if (componentsError) {
      console.error("Error fetching components", componentsError);
      throw redirect(302, "/dashboard");
    }

    if (projectError) {
      console.error("Error fetching project", projectError);
      throw redirect(302, "/dashboard");
    }

    // Use components and project here
    return {
      components,
      project_data: {
        name: project.name,
        id: project_id,
      },
    };

  } catch (error) {
    console.error("Error fetching data", error);
      throw redirect(302, "/dashboard");
  }
};
