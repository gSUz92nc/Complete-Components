<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  export let data;
  let { components, supabase, project_data } = data;

  let newComponentName = "";

  async function createNewComponent() {

    console.log("Creating a new component", newComponentName, data.project_data?.id);

    const { error } = await supabase.from("components").insert([
      {
        name: newComponentName,
        project_id: data.project_data?.id,
      },
    ]);

    // Check for errors
    if (error) {
      console.log("Error creating a new component", error);
    } else {
      console.log("New component created", data);
    }

    // Close the modal
    create_project_modal.close();

    // Goto the new component
    goto(`/editor/${data.project_data?.id}`);
  }

  let create_project_modal: any;

  onMount(() => {
    // Used for closing the modal when clicking outside of it
    create_project_modal = document.getElementById("create_project_modal");
  });
</script>

<dialog id="create_project_modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Create a New Component in {project_data?.name}</h3>
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
  <h1 class="text-center text-4xl font-semibold mt-8">{project_data?.name}</h1>
  <div class="flex flex-wrap justify-center mt-10">
    {#each components as component}
    <div class="card card-compact w-96 bg-base-100 shadow-xl mt-4 mx-5">
      <figure>
        <img
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">{component.name}</h2>
        <p>{(component.description ? component.description : "")}</p>
        <div class="card-actions justify-end">
          <a href={"/editor/" + component.id} class="btn btn-primary">Open In Editor</a>
        </div>
      </div>
    </div>
    {/each}
    <div class="card card-compact w-96 bg-base-100 shadow-xl mx-5 mt-4">
      <figure>
        <img
          src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Shoes"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">Create a Component</h2>
        <p>Create a new Login, Table, Sidebar all linked up to your backend</p>
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
