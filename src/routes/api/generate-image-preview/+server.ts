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

    const code_id = url.searchParams.get("code_id");

    const { data: codeData, error: codeError } = await supabaseAdmin.from(
      "component_code",
    ).select("*").eq("id", code_id).single();

    const code = codeData.code;
    const component_id = codeData.component_id;

    await page.setContent(formatCode(code), {
      waitUntil: "networkidle2",
    });

    page.waitForNetworkIdle();

    const html = await page.content();

    console.log("html", html)

    const image = await page?.screenshot({
      encoding: "base64",
    });

    // Upload the image to a storage bucket
    const { data, error } = await supabaseAdmin.storage.from("code_previews")
      .upload(
        `${component_id}/image.png`,
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


