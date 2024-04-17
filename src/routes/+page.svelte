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

<div class="h-screen w-screen flex justify-center">
  <div class="my-auto flex justify-center flex-col">
    <h1 class="text-4xl font-bold text-center">Welcome!</h1>
    <a class="btn btn-primary mt-8" href={(loggedIn ? '/dashboard' : '/login')}>Get Started</a>
  </div>
</div>