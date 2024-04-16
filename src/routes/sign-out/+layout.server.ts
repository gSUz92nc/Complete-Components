import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (
  { locals: { safeGetSession, supabase } },
) => {
  // Redirect to login if there is not a session
  let data = await safeGetSession();

  if (!data.session) {
    console.log("No session");
    return redirect(302, "/login");
  }

  // Sign out
  await supabase.auth.signOut();

  console.log("Signed out");
  return redirect(302, "/");
};
