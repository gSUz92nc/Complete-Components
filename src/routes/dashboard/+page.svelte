<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

    export let data;
    let { projects, supabase } = data;
    $: ({ projects, supabase } = data);

    let showModal = true;

    onMount(() => {
        console.log(data);
    });

    $: (console.log(showModal));

    let create_project_modal: any;

    onMount(() => {
      create_project_modal = document.getElementById("create_project_modal");
    });


    let newProjectName = "";

    async function createNewProject() {
      const { error } = await supabase.from("projects").insert([
        {
          name: newProjectName,
        },
      ]).select("id");

      // Check for errors
      if (error) {
        console.log("Error creating a new project", error);
      } else {
        console.log("New project created", data);
      }

      // Close the modal
      create_project_modal.close();

      // Redirect to the new project
      goto("dashboard/" + newProjectName);
    }

</script>



<dialog id="create_project_modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Create a New Project</h3>
    <p class="py-4">What would you like your project to be called</p>
    <div class="join w-full">
      <input class="input input-bordered join-item w-full" placeholder="Project Name" bind:value={newProjectName}/>
      <button class="btn join-item" on:click={createNewProject}>Create</button>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>


<h1 class="text-center text-4xl font-semibold mt-8">Dashboard</h1>
<div class="flex flex-wrap justify-center mt-10">
    {#each projects as project }
    <div class="card w-96 bg-base-100 shadow-xl mx-5 mt-4">
        <div class="card-body">
          <h2 class="card-title">{project.name}</h2>
          <div class="card-actions justify-end">
            <a href="/dashboard/{project.id}" class="btn btn-primary">Open</a>
          </div>
        </div>
      </div>
    {/each}
    <div class="card w-96 bg-base-100 shadow-xl mx-5 mt-4">
      <div class="card-body">
        <h2 class="card-title">Create a Project</h2>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" on:click={() => create_project_modal.showModal()}>Create</button>
        </div>
      </div>
    </div>
</div>
