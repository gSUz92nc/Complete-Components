<script lang="ts">
    export let data;
    let { components, supabase } = data;
</script>

<div class="card card-compact w-96 bg-base-100 shadow-xl">
  <figure>
    <img
      src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
      alt="Shoes"
    />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>


<h1 class="text-center text-4xl font-semibold mt-8">Dashboard</h1>
<div class="flex flex-wrap justify-center mt-10">
    {#each components as component }
    <div class="card w-96 bg-base-100 shadow-xl mx-5 mt-4">
        <div class="card-body">
          <h2 class="card-title">{component.name}</h2>
          <div class="card-actions justify-end">
            <a href="/editor/{component.id}" class="btn btn-primary">Open</a>
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
