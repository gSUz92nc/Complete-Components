<script lang="ts">
  import { onMount } from 'svelte';

  export let data;
  let { session } = data;



  // Check if there is a user
  let loggedIn = false;

  onMount(() => {
    if (session!.user) {
      loggedIn = true;
    }
  });


</script>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content flex-col lg:flex-row">
    <img alt="code preview" src="/image.png" class="max-w-sm h-96 shadow-2xl object-cover rounded-2xl"  />
    <div>
      <h1 class="text-5xl font-bold">Say hello to faster development</h1>
      <p class="py-6">Design, Build, Connect to your backend all in a few minutes</p>
      <a class="btn btn-primary mt-8" href={(loggedIn ? '/dashboard' : '/login')}>Get Started</a>
      <div class="flex align-center">
      <p class="mt-2">Powered by</p>
      <img alt="Supabase Logo" class="h-4 mt-3 ml-2" src="/supabase.webp">
      </div>
    </div>
  </div>
</div>