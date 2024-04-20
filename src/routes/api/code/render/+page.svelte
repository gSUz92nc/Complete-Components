<script lang="ts">
    export let data;

    const { code } = data;
</script>

<svelte:head>
    <script src="/tailwind.js"/>
</svelte:head>

<div class="flex justify-center items-center h-screen bg-gray-900">
    {@html code}
</div>