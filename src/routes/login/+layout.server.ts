import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (
  { locals: { safeGetSession } },
) => {
  // Redirect to dashboard if there is a session
  let data = await safeGetSession();

  if (data.session) {
    return redirect(302, "/dashboard");
  }
};
