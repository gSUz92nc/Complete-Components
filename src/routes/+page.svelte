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
  <div class="mt-[30rem] flex justify-center flex-col">
    <p class="text-center w-full">This project is paused. For more info check our github repository</p>
    <a class="link text-center mt-2" href="https://github.com/gSUz92nc/Complete-Components">https://github.com/gSUz92nc/Complete-Components</a>
  </div>
</div>