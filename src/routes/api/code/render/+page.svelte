<script lang="ts">
    import { onMount } from 'svelte';
    export let data;

    const { code } = data;

    onMount(() => {

    })
</script>

<svelte:head>
    <script src="/tailwind.js"/>
</svelte:head>

<div class="flex justify-center items-center h-full bg-gray-900">
    {@html code}
</div>