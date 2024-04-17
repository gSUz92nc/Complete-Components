<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
      goto("/dashboard")
  });
</script>

<p>There is nothing here and you should be redirected to the dashboard shortly, click the button below if that doesn't happen</p>
<a href="/dashboard" class="btn btn-primary">Go to Dashboard</a>
