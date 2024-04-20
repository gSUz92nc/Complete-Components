import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ url, locals: { supabase } }) => {

    // Check if params contains secret
    if (url.searchParams.get("secret") != "true") {
        return redirect(302, "/dashboard");
    }

    const id = url.searchParams.get("id");

    // Get code from database
    const { data: component, error: componentError } = await supabase.from("component_code").select("code").eq("id", id).single();


    return {
        code: component?.code,
    };
};
