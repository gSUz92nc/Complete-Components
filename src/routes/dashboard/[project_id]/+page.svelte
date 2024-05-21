<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  export let data;
  let { components, supabase, project_data, session } = data;

  let newComponentName = "";

  async function createNewComponent() {
    console.log(
      "Creating a new component",
      newComponentName,
      data.project_data?.id
    );

    const { data: newComponetData, error } = await supabase.from("components").insert([
      {
        name: newComponentName,
        project_id: data.project_data?.id,
      },
    ]).select("id");

    // Check for errors
    if (error) {
      console.log("Error creating a new component", error);
    } else {
      console.log("New component created", data);
    }

    // Close the modal
    create_project_modal.close();

    // Goto the new component
    goto(`/editor/${Array.isArray(newComponetData) ? newComponetData[0]?.id ?? "" : ""}`);
  }

  async function deleteComponent(component_id: string) {
    console.log("Deleting component", component_id);

    const { error } = await supabase
      .from("components")
      .delete()
      .eq("id", component_id);

    // Check for errors
    if (error) {
      console.log("Error deleting component", error);
    } else {
      console.log("Component deleted", data);
    }

    reloadComponents();
  }

  async function reloadComponents() {
    const { data, error } = await supabase
      .from("components")
      .select("*")
      .eq("project_id", project_data?.id)
      .order('created_at', { ascending: false });

    // Check for errors
    if (error) {
      console.log("Error loading components", error);
    } else {
      console.log("Components loaded", data);
      components = data;
    }
  }

  async function getSignedImage(componentId: string) {
    // Get the latest code id from the database
    const { data: codeData, error: codeError } = await supabase
      .from("component_code")
      .select("id")
      .eq("component_id", componentId)
      .limit(1)
      .order("id", { ascending: false });

    // Check for errors
    if (codeError) {
      console.log("Error getting code id", codeError);
    } else {
      console.log("Code id loaded", codeData);
    }

    const code_id = codeData && codeData.length > 0 ? codeData[0].id : null;

    const { data, error } = await supabase.storage
      .from("code_previews")
      .createSignedUrl(`${session?.user.id}/${code_id}/image.png`, 60);

    // If there is nothing set return /image.png
    if (error) {
      console.log("Error getting signed url", error);
      return "/image.png";
    }

    return data?.signedUrl;
  }

  let create_project_modal: any;

  onMount(() => {
    // Used for closing the modal when clicking outside of it
    create_project_modal = document.getElementById("create_project_modal");
  });
</script>

<dialog id="create_project_modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">
      Create a New Component in {project_data?.name}
    </h3>
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
  <p class="text-center mt-8 mx-12">Manage all the components in your project here. Each component has a timeline in it so you can go back to old changes if you don't like the new ones</p>
  <div class="flex flex-wrap justify-center mt-10">
    {#each components as component}
      <div class="card card-compact w-96 bg-base-100 shadow-xl mt-4 mx-5">
        {#await getSignedImage(component.id)}
          <p>Loading...</p>
        {:then signedUrl}
          <figure>
            <img src={signedUrl} alt="Code preview" />
          </figure>
        {/await}
        <div class="card-body">
          <h2 class="card-title">{component.name}</h2>
          <p>{component.description ? component.description : ""}</p>
          <div class="card-actions justify-between w-full">
            <button
              on:click={() => deleteComponent(component.id)}
              class="btn btn-warning">Delete</button
            >
            <a href={"/editor/" + component.id} class="btn btn-primary"
              >Open In Editor</a
            >
          </div>
        </div>
      </div>
    {/each}
    <div class="card card-compact w-96 bg-base-100 shadow-xl mx-5 mt-4">
      <figure>
        <img
          src="/image.png"
          alt="Code Preview"
        />
      </figure>
      <div class="card-body">
        <h2 class="card-title">Create a Component</h2>
        <p>Use our login template to get started</p>
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
