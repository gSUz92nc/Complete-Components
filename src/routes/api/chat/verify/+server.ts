import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "$env/static/private";
import puppeteer from "puppeteer";
import { env } from "$env/dynamic/public";
import type { MessageParam } from "@anthropic-ai/sdk/resources/messages.mjs";


const client = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

const url = env.PUBLIC_URL;

const browser = await puppeteer.launch();
const page = await browser.newPage();
page.setViewport({ width: 896, height: 1344 });

function formatCode(code: string) {
  // Add <script src="/tailwind.js"></script>
  let formattedCode = `<head><script src="${url}/tailwind.js"></script></head>`;
  // Add the code
  formattedCode += `<div class="flex justify-center items-center h-full bg-gray-900">`;
  formattedCode += code;
  formattedCode += `</div>`;

  console.log(formattedCode);
  return formattedCode;
}

export const POST = async ({ request }) => {
  try {
    const body = await request.json();

    console.log(body);

    const userPrompt: string = body.prompt;
    const code: string = body.code;

    await page.setContent(formatCode(code), {
      waitUntil: "networkidle2",
    });

    const image = await page?.screenshot({
      encoding: "base64",
    });

    // Ask Anthropic to verify the changes
    const messages: MessageParam[] = [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              data: image,
              type: "base64",
              media_type: "image/png",
            },
          },
          {
            text:
              "These are the changes I wanted, does the image contain all the changes I wanted: " +
              userPrompt,
            type: "text",
          },
        ],
      },
    ];

    const response = await client.messages.create({
      messages,
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: `You are a quality checker for an autonomous code editor. Your job is to determine whether generated code matches what the user requested. You are given and image the prompt the user send and need to determine whether the image satisfies the request of the user. If it does include [[SATISFY]] in your generated text`
    });

    console.log("Response:", response);

    return new Response(JSON.stringify({ response: response.content[0].text }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("There was an error verifying changes", {
      status: 500,
    });
  }
};
