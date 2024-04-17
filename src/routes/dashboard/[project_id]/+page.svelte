<script lang="ts">
  import { onMount } from "svelte";

  export let data;
  let { components, supabase, project_name } = data;

  let showModal = false;

  let create_project_modal: any;

  let newComponentName = "";

  async function createNewComponent() {
    const { error } = await supabase.from("components").insert([
      {
        name: newComponentName,
      },
    ]);

    // Check for errors
    if (error) {
      console.log("Error creating a new component", error);
    } else {
      console.log("New component created", data);
    }

    // Close the modal
    showModal = false;
  }

  onMount(() => {
    // Used for closing the modal when clicking outside of it
    create_project_modal = document.getElementById("create_project_modal");
  });
</script>

<dialog id="create_project_modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Create a New Component in {project_name}</h3>
    <p class="py-4">What would you like your project to be called</p>
    <div class="join w-full">
      <input
        class="input input-bordered join-item w-full"
        placeholder="Project Name"
        bind:value={newComponentName}
      />
      <button class="btn join-item" on:click={createNewComponent}>Create</button
      >
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<div class="w-screen">
  <h1 class="text-center text-4xl font-semibold mt-8">{project_name}</h1>
  <div class="flex flex-wrap justify-center mt-10">
    {#each components as component}
    <div class="card card-compact w-96 bg-base-100 shadow-xl">
      <figure>
        <img
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{component.name}</h2>
        <p>{component.description}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Open In Editor</button>
        </div>
      </div>
    </div>
    {/each}
    <div class="card card-compact w-96 bg-base-100 shadow-xl mx-5">
      <figure>
        <img
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">Create a Project</h2>
        <div class="card-actions justify-end">
          <button
            class="btn btn-primary"
            on:click={() => create_project_modal.showModal()}>Create</button
          >
        </div>
      </div>
    </div>
  </div>
</div>
