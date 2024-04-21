import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "$env/static/private";
import { supabaseAdmin } from "$lib/supabase/supabaseAdmin";
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";

export const POST = async ({ request }) => {
  try {
    const client = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    const body = await request.json();

    // Create supabase client
    const authHeader = request.headers.get('Authorization')!

    const supabaseClient = createClient(
      PUBLIC_SUPABASE_URL,
      PUBLIC_SUPABASE_ANON_KEY,
      { global: { headers: { Authorization: authHeader } } }
    );


    const messages = parseMessagesToAnthropic(body.messages);
    const code = body.code;
    let streamedMessage = "";

    // RAG
    let ragContent = "";

    const messageLength = messages.length;
    let lastUserMessage = "";

    if (messages[messageLength - 1].role != "user") {
      return new Response("Error", { status: 400 });
    } else {
      lastUserMessage = messages[messageLength - 1].content;
    }

    // Get embedding
    const { data } = await supabaseAdmin.functions.invoke(
      "generate_embedding",
      {
        body: {
          input: lastUserMessage,
        },
      },
    );

    // Get RAG response
    let { data: ragData, error } = await supabaseAdmin
      .rpc("js_rag", {
        match_count: 10,
        query_embedding: data.embedding,
      });
    if (error) console.error(error);

    ragData.forEach((element: { f1: string, f2: string}) => {
      // Check if f1 != ""
      if (element.f1 != "") {
        ragContent += element.f1 + "\n";
      }

      // Check if f2 != ""
      if (element.f2 != "") {
        ragContent += element.f2 + "\n";
      }
    });

    let tagOpen = false;
    let possibleTag = "";
    let codeTagText = "";
    let codeTagOpen = false;
    let confirmedTag = false;
    let sendingCode = false;

    let possibleTagAttempts = 0;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        client.messages
          .stream({
            messages,
            model: "claude-3-haiku-20240307", // claude-3-haiku-20240307   claude-3-sonnet-20240229 	claude-3-opus-20240229 But its pretty expensive -_-
            max_tokens: 4096,
            system:
              `You are a helpful that can helps users create components for their SvelteKit projects using TailwindCSS. You can read their current code in this prompt and write improvements to it. You must always respond in XML format. You can edit the user's code using the <code></code> tags. You do not need to include <code> tags if you are not planning on changing the code. Only change the code if the user asks to. If the user asks for help you can answer their questions but stress that you may be wrong. When ever using the <code> tags you must rewrite all of the code including code you don't intent on modifying. They are <code> Used for when you want to edit the .svelte content in their SvelteKit project. This includes their scripts, html, imports<code/>. Always include some text outside of the <code> tags. Before making any changes say something like: "Certainly" or "OK" then make a simple short list using "-" as bullet points, then go into the <code> tags. There is no need to center your outermost div since that is already done client side for the user so do not include <div class="flex justify-center items-center h-screen"> in your outermost div\n\nHere is their code:\n\n"${code}"\n\nMake sure to look through their code before writing anything, for instance if they have a login component that has a Login with Github, make sure to include login with github in the supabase code.\n\nHere is some helpful documentation that you can use to improve accuracy when using supbase:\n\n ${ragContent}\n\nYou need to use these docs whenever doing anything related to database, authentication, edge functions, storage, realtime, and vector embeddings. Always assume the user has imported supabase at the top of their <script>. Only make changes the user has asked for. Never reference any other files other than the .svelte file supplied. Include <code> tags if the user doesn't have any changes in their prompt. Only do what the user wants you to do and if it is unclear do not change the code and ask for clarity. If the users current prompt doesn't ask for any changes. Don't make any changes. Don't use any other <XML> tags other than <code>, for instance never use <response>, <message>, etc. .You will always be supplied the code and never need to ask the user for the code`,
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

                  console.log("Code tag text:", codeTagText);

                  saveCodeToDatabase(supabaseClient, codeTagText, body.component_id);



                  // Reset the code tag text
                  codeTagText = "";
                  tagOpen = false;
                  possibleTag = "";
                  possibleTagAttempts = 0;
                  codeTagOpen = false;
                  confirmedTag = false;
                  sendingCode = true;
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

async function saveCodeToDatabase(supaClient: any, newCode: string, component_id: string) {

  const { error } = await supaClient.from("component_code").insert(
    {
      code: newCode,
      component_id: component_id,
    },
  );

  console.log("Error:", error);
}
