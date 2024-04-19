import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "$env/static/private";

export const POST = async ({ request }) => {
  try {
    const client = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    const body = await request.json();

    const messages = parseMessagesToAnthropic(body.messages);
    const code = body.code;
    let streamedMessage = "";

    let tagOpen = false;
    let possibleTag = "";
    let codeTagText = "";


    let possibleTagAttempts = 0;

    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();

        client.messages
          .stream({
            messages,
            model: "claude-3-haiku-20240307",
            max_tokens: 4096,
            system: `You are a helpful assistant that can helps users create components for their SvelteKit projects using TailwindCSS. You can read their current code in this prompt and write improvements to it. You must always respond in XML format. You can answer in 2 XML tags. They are <code>Used for when you want to edit the .svelte content in their SvelteKit project. This includes their scripts, html, imports<code/>, and <message>Text here is returned to the User. Only text here can be read by the user<message/>.\nHere is their code:\n\n"${code}"`,
          })
          .on("text", (text) => {
            console.log("Data:", text);

            streamedMessage += text;

            // Check if the incoming text is included in a tag
            if (
              "<code>".includes(text) ||
              "<message>".includes(text) ||
              tagOpen
            ) {

              possibleTagAttempts++;
              possibleTag += text;

              if (possibleTagAttempts > 10) {
                // If the tag is not closed, add the text to the stream
                tagOpen = false;

                const chunk = encoder.encode(possibleTag);
                controller.enqueue(chunk);
                return;
              }

              // Check if the tag is a code tag
              if (possibleTag.includes("<code>")) {
                // If it is a code tag, add the rest of the text to the code tag text
                codeTagText += text;
              }

              // Add to the stream
              const chunk = encoder.encode(text);
              controller.enqueue(chunk);
            }
          })
          .on("error", (error) => {
            // Handle the error
            console.error("Stream error:", error);
            const errorChunk = encoder.encode(
              `${JSON.stringify({ type: "error", error: error.message })}\n\n`
            );
            controller.enqueue(errorChunk);
            controller.enqueue(encoder.encode("event: close\ndata: null\n\n"));
            controller.close();
          })
          .on("end", () => {
            // Handle the end of the stream
            console.log("Stream end");
            controller.enqueue(encoder.encode(streamedMessage));
            controller.enqueue(encoder.encode("event: close\ndata: null\n\n"));
            controller.close();
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

function parseMessagesToAnthropic(messages: any[]) {
  // Code to parse the messages to the Anthropic format
  console.log("Parsing messages to Anthropic format:", messages);

  let parsedMessages = [];

  // Parse the messages
  for (const message of messages) {
    parsedMessages.push({
      role:
        message.messenger == "ai"
          ? "assistant"
          : ("user" as "assistant" | "user"),
      content: message.content as string,
    });
  }

  console.log("Parsed messages:", parsedMessages);
  return parsedMessages;
}
