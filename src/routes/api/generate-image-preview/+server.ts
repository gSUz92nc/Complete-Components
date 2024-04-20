import puppeteer from "puppeteer-core";
import { supabaseAdmin } from "$lib/supabase/supabaseAdmin";
import { BRIGHT_DATA_PASS, BRIGHT_DATA_USER } from "$env/static/private";

const AUTH = `${BRIGHT_DATA_USER}:${BRIGHT_DATA_PASS}`; // Add your username and password here
const SBR_WS_ENDPOINT = `wss://${AUTH}@brd.superproxy.io:9222`;

function formatCode(code: string) {
  // Add <script src="/tailwind.js"></script>
  let formattedCode = `<head><script src="https://cdn.tailwind.com"></script></head>`;
  // Add the code
  formattedCode +=
    `<div class="flex justify-center items-center h-full bg-gray-900">`;
  formattedCode += code;
  formattedCode += `</div>`;
  
  return formattedCode;
}

function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const GET = async ({ url }) => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: SBR_WS_ENDPOINT,
  });

  console.log("Connected to browser");

  try {
    const page = await browser.newPage();

    const id = url.searchParams.get("id")

    await page.goto("https://complete-components.vercel.app/api/code/render?secret=true&id=" + id);

    await page.waitForNetworkIdle()

    const html = await page.content();

    console.log("html", html)

    const image = await page?.screenshot({
      encoding: "base64",
    });

    // Upload the image to a storage bucket
    await supabaseAdmin.storage.from("code_previews")
      .upload(
        `${id}/image.png`,
        base64ToArrayBuffer(image),
        {
          contentType: "image/png",
        },
      );

    return new Response(
      JSON.stringify({ response: "success" }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);
    return new Response("There was an error", {
      status: 500,
    });
  } finally {
    await browser.close();
  }
};


