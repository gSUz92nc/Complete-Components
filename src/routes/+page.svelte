<script>
  export let data;
  let { supabase } = data;
  $: ({ supabase } = data);
</script>

<h1 class="font-semibold text-9xl">Test</h1>
