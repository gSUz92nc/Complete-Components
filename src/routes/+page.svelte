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
    <p class="text-center mt-4">This project is paused. For more info check our github repository</p>
    <a class="link text-center mt-2" href="https://github.com/gSUz92nc/Complete-Components">https://github.com/gSUz92nc/Complete-Components</a>
  </div>
</div>