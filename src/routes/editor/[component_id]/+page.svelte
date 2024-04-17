<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { html } from "@codemirror/lang-html";
  import { oneDark } from "@codemirror/theme-one-dark";
  import example_code from "$lib/text/example_component.js";
  

  export let data;
  let { component, supabase } = data;

  let code = example_code;

</script>

<div class="drawer h-screen">
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="w-full navbar bg-base-300">
      <div class="flex-none lg:hidden">
        <label
          for="my-drawer-3"
          aria-label="open sidebar"
          class="btn btn-square btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-6 h-6 stroke-current"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path></svg
          >
        </label>
      </div>
      <a href={"/dashboard/" + component.project_id} class="flex-1 px-2 mx-2">{component.name}</a>
      <div class="flex-none hidden lg:block">
        <ul class="menu menu-horizontal">
          <!-- Navbar menu content here -->
          <li><a>Navbar Item 1</a></li>
          <li><a>Navbar Item 2</a></li>
        </ul>
      </div>
    </div>
    <!-- Page content here -->
    <div class="flex flex-col sm:flex-row w-full h-full p-4">
      <div
        class="mockup-code h-full w-full mr-2 border border-base-300"
      >
        <CodeMirror
          class="w-full h-full overflow-scroll"
          bind:value={code}
          lang={html()}
          theme={oneDark}
          styles={{
            "&": {
              width: "100%",
              height: "100%",
              overflow: "scroll",
            },
          }}
        />
      </div>
      <div class="flex flex-col w-full">
        <div
          class="mockup-window border border-base-300 bg-base-300 ml-2 mb-2 h-full"
        >
          <div class="flex justify-center items-center h-full overflow-scroll pt-[5rem]">
            {@html code}
          </div>
        </div>
        <div
          class="border border-base-300 rounded-2xl h-full mt-2 ml-2"
        >
          <div class="chat chat-start rounded-2xl">
            <div class="chat-bubble">
              It's over Anakin, <br />I have the high ground.
            </div>
          </div>
          <div class="chat chat-end">
            <div class="chat-bubble">You underestimate my power!</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"
    ></label>
    <ul class="menu p-4 w-80 min-h-full bg-base-200">
      <!-- Sidebar content here -->
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>
