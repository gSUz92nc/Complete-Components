<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { html } from "@codemirror/lang-html";
  import { oneDark } from "@codemirror/theme-one-dark";
  import example_code from "$lib/text/example_component.js";
  import { onMount } from "svelte";
  import { decode } from "html-entities";

  export let data;
  let { component, loadedCode, supabase, session } = data;

  let code = ""; // `<button class="bg-green-100">Hello!</button>`;

  let messages: any[] = [];
  let loadingMessages = false;
  let confirmNewChat = false;
  let newMessage = "";
  let streamingMessage = false;
  let coding = false;
  let selectedTab = "svelte" as "svelte" | "history";

  async function startNewChat() {
    // Close the dialog
    confirmNewChat = false;
    streamingMessage = false;
    messages = [];
    newMessage = "";
  }

  let streamedMessage = "";
  let analysingMessage = false;

  // Sends the message to the AI endpoint, which returns a response aswell as saves the message to the table
  async function sendMessage() {

    console.log("Sending message")

    if (streamingMessage || newMessage == "") {
      console.log("Sending message 1")
      return;
    } else {
      streamingMessage = true;
    }

    

    analysingMessage = true;

    // Add the message to the array
    messages = [
      ...messages,
      {
        content: newMessage,
        messenger: "user",
        created_at: new Date(),
        component_id: component.id,
      },
    ];

    // Clear the message
    newMessage = "";

    // Stream the message from the AI endpoint
    // const stream = await fetch("/api/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "text/event-stream",
    //     "Authorization": `Bearer ${session?.access_token}`,
    //   },
    //   body: JSON.stringify({
    //     messages,
    //     component_id: component.id,
    //     code,
    //   }),
    // });

    const stream = await fetch("https://wrnmfdfizduyptqsvbnm.supabase.co/functions/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({
        messages,
        component_id: component.id,
        code,
      })
    })

    console.log(stream)
    console.log("stream:", typeof stream)

    const reader = stream.body
      ?.pipeThrough(new TextDecoderStream())
      .getReader();

    while (true) {
      if (reader == null) {
        console.log("Reader is null");
        // Wait a second before trying again
        await new Promise((resolve) => setTimeout(resolve, 1000))
        continue;
      } 
      const { value, done } = (await reader.read()) as {
        value: any;
        done: boolean;
      };

      console.log("Value:", value);
      console.log("Done:", done);

      if (value) {
        analysingMessage = false;

        if (value.includes("[DONE]" || done)) {
          console.log("Closing stream");
          break;
        }

        if (value.includes("[CURRENTLY_CODING]")) {
          console.log("Currently coding");

          coding = true;

          // Trim the excess whitespace from the streamed message
          streamedMessage = streamedMessage.trim();

          continue;
        } else {
          coding = false;
        }

        // Check value for new code content
        if (value.includes("NEW_CODE:")) {
          // Ignore the first 9 characters
          const tempCode = value.slice(9);

          // Convert html entities to characters
          code = decode(tempCode);

          // Upload the new code to the database
          const { data } = await supabase
            .from("component_code")
            .insert({
              code,
              component_id: component.id,
              user_id: session?.user.id,
            })

          continue;
        }

        console.log("Value:", value);
        streamedMessage += value;
      }
    }
    // Add the message to the array
    messages = [
      ...messages,
      {
        content: streamedMessage,
        messenger: "ai",
        created_at: new Date(),
        component_id: component.id,
      },
    ];

    console.log("DONE");
    streamedMessage = "";
    streamingMessage = false;
  }

  // Scrolls to the bottom of the chat
  function scrollToBottom(node: any, arg: any) {
    const scroll = () =>
      node.scroll({
        top: node.scrollHeight,
        behavior: "smooth",
      });
    scroll();

    return { update: scroll };
  }

  // Controls the theme for the component preview tab, saved between sessions using supabase
  let theme = component.theme || "dark";

  // Toggles the theme between dark and light
  async function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";

    // Update the theme in supabase
    const { error } = await supabase
      .from("components")
      .update({ theme })
      .match({ id: component.id });

    if (error) {
      console.error("Error updating theme", error);
    }
  }

  async function saveCode() {
    console.log({ code, component_id: component.id });

    const { error } = await supabase
      .from("component_code")
      .insert([{ code, component_id: component.id }]);

    if (error) {
      console.error("Error saving code", error);
    }
  }

  async function rollback(newCode: string) {
    code = newCode;

    saveCode();
  }

  async function getSignedImage(id: string) {
    const { data, error } = await supabase.storage
      .from("code_previews")
      .createSignedUrl(`${session?.user.id}/${id}/image.png`, 60);

    if (error) {
      console.error("Error getting signed image", error);
    }

    return data?.signedUrl;
  }

  let channels: any

  onMount(() => {
    if (loadedCode[0] === undefined || loadedCode[0].code === undefined) {
      console.log("EXAMPLE");
      code = example_code;
    } else {
      code = loadedCode[0].code;
    }

    channels = supabase.channel(`components:${component.id}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'component_code' },
      (payload) => {
        loadedCode = [payload.new, ...loadedCode];
        code = payload.new.code;  
      }
    )
    .subscribe()
      

    // When ENTER is pressed, send the message
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        // Check if the textarea is focused
        if (document.activeElement !== document.querySelector("textarea")) {
          return;
        }

        sendMessage();
        // Stop the textarea from adding a new line
        e.preventDefault();
        // Unfocus the textarea
      }
    });
  });
</script>

<svelte:head>
  <script src="/tailwind.js"></script>
  <!-- GOING TO BE USED FOR THEMES -->
  <!-- <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            clifford: '#da373d',
          }
        }
      }
    }
  </script> -->
</svelte:head>

{#if confirmNewChat}
  <dialog id="confirm" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Just a heads up</h3>
      <p class="py-4">
        Starting a new conversation deletes the current conversation
      </p>
      <div class="flex justify-center">
        <button class="btn grow mr-2 btn-error" on:click={startNewChat}
          >Start New Conversation</button
        >
        <button
          class="btn grow ml-2 btn-success"
          on:click={() => (confirmNewChat = false)}>Close</button
        >
      </div>
    </div>
  </dialog>
{/if}

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
      <a href={"/dashboard/" + component.project_id} class="flex-1 px-2 mx-2"
        >{component.name}</a
      >
      <div class="flex-none hidden lg:block">
        <ul class="menu menu-horizontal">
          <!-- Navbar menu content here -->
          <li><a href="/dashboard">Back to Dashboard</a></li>
        </ul>
      </div>
    </div>
    <!-- Page content here -->
    <div
      class="flex flex-col sm:flex-row w-full p-4 h-[calc(100vh-6rem)] max-w-screen"
    >
      <div
        class="relative h-full sm:max-w-[50%] sm:w-[50%] sm:min-w-[50%] w-full mr-2 border border-base-300 rounded-2xl"
      >
        <div class="absolute w-full">
          <div role="tablist" class="tabs tabs-lifted shrink">
            {#if selectedTab == "svelte"}
              <button
                role="tab"
                class="tab h-12 tab-active"
                on:click={() => (selectedTab = "svelte")}>.svelte</button
              >
              <button
                role="tab"
                class="tab h-12"
                on:click={() => (selectedTab = "history")}>history</button
              >
            {:else}
              <button
                role="tab"
                class="tab h-12"
                on:click={() => (selectedTab = "svelte")}>.svelte</button
              >
              <button
                role="tab"
                class="tab h-12 tab-active"
                on:click={() => (selectedTab = "history")}>history</button
              >
            {/if}
          </div>
        </div>
        {#if selectedTab == "svelte"}
          <CodeMirror
            class="w-full h-full overflow-scroll pt-12 overflow-hidden rounded-b-2xl"
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
          <button
            on:click={saveCode}
            class="right-2 bottom-2 btn btn-primary absolute">Save</button
          >
        {:else}
          <div class="flex w-full h-full pt-12 flex-col overflow-y-scroll">
            {#each loadedCode as code}
              {#await getSignedImage(code.id) then signedUrl}
              <div class="flex flex-row">
                <div class="overflow-hidden w-1/2 h-32 flex justify-center">
                    <button class="btn my-auto" on:click={() => rollback(code.code)}>Go back to this version</button>
                </div>
                <div class="overflow-y-scroll w-1/2 h-32">
                  <img
                    alt="Loading preview... We may still be generating the preview for this version. Please refresh in a few seconds."
                    class="w-full"
                    src={signedUrl}
                  />
                </div>
              </div>
              {/await}
            {/each}
          </div>
        {/if}
      </div>
      <div class="flex flex-col w-full">
        <div
          class="mockup-window border border-base-300 bg-neutral ml-2 mb-2 h-full"
        >
          <div class="absolute right-3 top-3">
            {#if theme === "dark"}
              <!-- sun icon -->
              <button on:click={toggleTheme}
                ><svg
                  class="swap-off fill-current w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
                  /></svg
                ></button
              >
            {:else}
              <!-- moon icon -->
              <button on:click={toggleTheme}>
                <svg
                  class="swap-on fill-current w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
                  /></svg
                >
              </button>
            {/if}
          </div>
          <div
            class={"flex justify-center items-center h-full overflow-scroll pt-[5rem] " +
              (theme == "dark" ? "bg-base-200" : "bg-white")}
          >
            {@html code}
          </div>
        </div>
        <div
          class="border bg-base-200 border-base-300 rounded-2xl overflow-y-scroll h-full mt-2 ml-2 relative"
        >
          <div
            class="overflow-y-scroll h-full pb-24"
            use:scrollToBottom={{ messages, streamedMessage }}
          >
            {#if loadingMessages}
              <div class="chat chat-start rounded-2xl h-24">
                <div class="chat-bubble w-[90%] h-full skeleton" />
              </div>
              <div class="chat chat-end">
                <div class="chat-bubble w-full h-full skeleton" />
              </div>
            {:else}
              {#each messages as message}
                {#if message.messenger == "ai"}
                  <div class="chat chat-start">
                    <div class="relative chat-bubble whitespace-pre-line">
                      {message.content}
                    </div>
                  </div>
                {:else}
                  <div class="chat chat-end">
                    <div class="chat-bubble whitespace-pre-line">
                      {message.content}
                    </div>
                  </div>
                {/if}
              {/each}
              {#if analysingMessage}
                <div class="chat chat-start">
                  <div class="chat-bubble whitespace-pre-line">
                    <span class="loading loading-dots loading-md"></span><i
                      class="ml-2 align-top">Analysing Message</i
                    >
                  </div>
                </div>
              {/if}
              {#if streamedMessage != ""}
                <div class="chat chat-start">
                  <div class="chat-bubble whitespace-pre-line">
                    {streamedMessage}
                    {#if coding}
                      <br /><span class="loading loading-dots loading-md"
                      ></span><i class="ml-2 align-top">Generating Code</i>
                    {/if}
                  </div>
                </div>
              {/if}
            {/if}
          </div>
          <div class="absolute bottom-2 w-full px-2">
            <button
              class="ml-2 text-sm"
              on:click={() => (confirmNewChat = true)}
              >Start new conversation?</button
            >
            <div class="join w-full">
              <textarea
                class="input input-bordered join-item w-full pt-2 min-h-12"
                placeholder="What do you want done?"
                bind:value={newMessage}
              />
              <button
                class="btn join-item input-bordered w-20 text-md h-full"
                on:click={sendMessage}>Send</button
              >
            </div>
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
      <li><a href="/dashboard">Back to Dashboard</a></li>
    </ul>
  </div>
</div>
