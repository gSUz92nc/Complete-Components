<script>
    import "../app.css";


    import { onMount } from "svelte";

    // if url isn't / then redirect to /
    onMount(() => {
        if (location.pathname !== "/") {
            location.pathname = "/";
        }
    });

</script>


<svelte:head>
    <title>Complete Components</title>
</svelte:head>

<slot />