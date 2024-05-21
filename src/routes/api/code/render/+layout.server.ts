import { supabaseAdmin } from "$lib/supabase/supabaseAdmin";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ url }) => {

    // Check if params contains secret
    if (url.searchParams.get("secret") != "true") {
        return redirect(302, "/dashboard");
    }

    const id = url.searchParams.get("id");

    // Get code from database
    const { data: component } = await supabaseAdmin.from("component_code").select("code").eq("id", id).single();

    console.log("id", id)

    return {
        code: component?.code,
    };
};
