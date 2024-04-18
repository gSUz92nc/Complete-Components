import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "$env/static/private";

export const POST = async ({ request }) => {
  console.log("Request");

  const client = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
  });

  const body = await request.json();

  let streamedMessage = "";

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      client.messages
        .stream({
          messages: [{ role: "user", content: "Hello" }], // body.messages,
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
        })
        .on("text", (text) => {
          console.log("Data:", text);

          streamedMessage += text;

          // Add to the stream
          const chunk = encoder.encode(text);
          controller.enqueue(chunk);
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
};

function saveMessageToDatabase(message) {
  // Code to save the message to the database
  console.log("Saving message to database:", message);
}
