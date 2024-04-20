import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "$env/static/private";
import { supabaseAdmin } from "$lib/supabase/supabaseAdmin";

export const POST = async ({ request }) => {
  try {
    const client = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    const body = await request.json();

    const messages = parseMessagesToAnthropic(body.messages);
    const code = body.code;
    let streamedMessage = "";

    // RAG
    let ragContent = "";

    console.log("Messages:", messages);

    const messageLength = messages.length;
    let lastUserMessage = "";

    if (messages[messageLength - 1].role != "user") {
      return new Response("Error", { status: 400 });
    } else {
      lastUserMessage = messages[messageLength - 1].content;
    }

    console.log("Last user message:", lastUserMessage);

    const checkIfNeedRag = await client.messages.create({
      model: "claude-3-haiku-20240307",
      messages: [{ role: "user", content: "This is what I want to be added to my code: " + lastUserMessage + "\n\nHere is my code: \n\n" + code }],
      max_tokens: 4096,
      system:
        `You are a simple concise assistant, that never says more than a couple of words, that checks a user's prompt and then decides if you need extra information to complete their request. These are the types of answers you can give: "[NEED_SUPABASE_DOCS]" when you load extra information about how to implement code relating to supabase. You need to use these docs whenever doing anything related to database, authentication, edge functions, storage, realtime, and vector embeddings. If you don't need anything to write the code or answer the user's prompt you can just say "NO"`,
    });

    console.log("Check if need RAG:", checkIfNeedRag);

    if (checkIfNeedRag.content.toString().toLowerCase().includes("docs")) {
      // Get embedding
      const { data } = await supabaseAdmin.functions.invoke(
        "generate_embedding",
        {
          body: {
            input: messages[-1].content,
          },
        },
      );

      console.log("Embedding:", data);

      // Get RAG response
      let { data: ragData, error } = await supabaseAdmin
        .rpc("js_rag", {
          match_count: 5,
          match_threshold: 0.8,
          query_embedding: data.embedding,
        });
      if (error) console.error(error);
      else {
        console.log(data);
        ragContent = ragData[0].response;
      }
    }

    let tagOpen = false;
    let possibleTag = "";
    let codeTagText = "";
    let codeTagOpen = false;
    let confirmedTag = false;

    let possibleTagAttempts = 0;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        client.messages
          .stream({
            messages,
            model: "claude-3-haiku-20240307",
            max_tokens: 4096,
            system:
              `You are a helpful that can helps users create components for their SvelteKit projects using TailwindCSS. You can read their current code in this prompt and write improvements to it. You must always respond in XML format. You can edit the user's code using the <code></code> tags. When ever using the <code> tags you must rewrite all of the code including code you don't intent on modifying. They are <code>Used for when you want to edit the .svelte content in their SvelteKit project. This includes their scripts, html, imports<code/>. Always include some text outside of the <code> tags. Before making any changes say something like: "Certainly" or "OK" then make a simple short list using "-" as bullet points, then go into the <code> tags. There is no need to center your outermost div since that is already done client side for the user so do not include <div class="flex justify-center items-center h-screen"> in your outermost div\n\nHere is their code:\n\n"${code}"\n\nMake sure to look through their code before writing anything, for instance if they have a login component that has a Login with Github, make sure to include login with github in the supabase code.\n\nHere is some helpful documentation that you can use to improve accuracy when using supbase:\n\n ${ragContent}\n\nYou need to use these docs whenever doing anything related to database, authentication, edge functions, storage, realtime, and vector embeddings. Always assume the user has imported supabase at the top of their <script>. Only make changes the user has asked for. Never reference any other files other than the .svelte file supplied`,
          })
          .on("text", (text) => {
            streamedMessage += text;

            // Check if the incoming text is included in a tag
            if ("<code>".includes(text) || tagOpen) {
              tagOpen = true;

              possibleTagAttempts++;
              possibleTag += text;

              // Check if the tag is really a tag
              if (
                !confirmedTag &&
                possibleTagAttempts > 10 &&
                !possibleTag.includes("<code>")
              ) {
                tagOpen = false;

                const chunk = encoder.encode(possibleTag);
                controller.enqueue(chunk);

                possibleTag = "";
                possibleTagAttempts = 0;
                return;
              }

              // Check if the tag is a code tag
              if (possibleTag.includes("<code>") || codeTagOpen) {
                confirmedTag = true;
                codeTagOpen = true;

                // If it is a code tag, add the rest of the text to the code tag text
                codeTagText = possibleTag;

                // Check if the tag is closing
                if (codeTagText.includes("</code>")) {
                  // Trim the code tag text to remove the tag
                  codeTagText = codeTagText.replace("<code>", "");
                  codeTagText = codeTagText.replace("</code>", "");

                  // Send the code tag text to the frontend
                  const chunk = encoder.encode("NEW_CODE:" + codeTagText);
                  controller.enqueue(chunk);

                  console.log("Code tag text trimmed:", codeTagText);

                  // Reset the code tag text
                  codeTagText = "";
                  tagOpen = false;
                  possibleTag = "";
                  possibleTagAttempts = 0;
                  codeTagOpen = false;
                  confirmedTag = false;
                }
              }

              if (confirmedTag) {
                const chunk = encoder.encode("[CURRENTLY_CODING]");
                controller.enqueue(chunk);
              }
            } else {
              // Add to the stream
              const chunk = encoder.encode(text);
              controller.enqueue(chunk);
            }
          })
          .on("error", (error) => {
            // Handle the error
            console.error("Stream error:", error);
            const errorChunk = encoder.encode(
              `${JSON.stringify({ type: "error", error: error.message })}\n\n`,
            );
            controller.enqueue(errorChunk);
            controller.enqueue(encoder.encode("[ERROR]"));
            if (controller.desiredSize !== null) {
              //controller.close();
          }
            // Return an appropriate response or rethrow the error
            return new Response("Error", { status: 500 });
          })
          .on("end", () => {
            // Handle the end of the stream
            // Check if the possibleTag is not empty
            if (possibleTag !== "") {
              const chunk = encoder.encode(possibleTag);
              controller.enqueue(chunk);
            }
            controller.enqueue(encoder.encode("[DONE]"));
            if (controller.desiredSize !== null) {
              //controller.close();
          }

            // Return an appropriate response
            return new Response("Done", { status: 200 });
          });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    // Handle the error
    // Return an appropriate response or rethrow the error
  }
};

function saveMessageToDatabase(message: string) {
  // Code to save the message to the database
  console.log("Saving message to database:", message);
}

// Parse the messages to the Anthropic format
function parseMessagesToAnthropic(messages: any[]) {
  let parsedMessages = [];

  // Parse the messages
  for (const message of messages) {
    parsedMessages.push({
      role: message.messenger == "ai"
        ? "assistant"
        : ("user" as "assistant" | "user"),
      content: message.content as string,
    });
  }

  return parsedMessages;
}
