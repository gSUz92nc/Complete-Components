// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../supabase/types/types.ts'

declare global {
	namespace App {
		// interface Error {}
		 interface Locals {
			supabase: SupabaseClient<Database>;
			getSession: () => Promise<any>; // Replace 'any' with the actual type of the session
			safeGetSession: () => Promise<any>; // Replace 'any' with the actual type of the session
		 }
		 interface PageData {
			session: Session | null;
		  }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
