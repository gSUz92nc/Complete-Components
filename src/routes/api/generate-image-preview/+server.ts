import puppeteer from "puppeteer";
import { env } from "$env/dynamic/public";
import { supabaseAdmin } from "$lib/supabase/supabaseAdmin";

const url = env.PUBLIC_URL;

function formatCode(code: string) {
  // Add <script src="/tailwind.js"></script>
  let formattedCode = `<head><script src="${url}/tailwind.js"></script></head>`;
  // Add the code
  formattedCode +=
    `<div class="flex justify-center items-center h-full bg-gray-900">`;
  formattedCode += code;
  formattedCode += `</div>`;

  console.log(formattedCode);
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
  try {

    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({ width: 896, height: 1344 });


    const code_id = url.searchParams.get("code_id");

    const { data: codeData, error: codeError } = await supabaseAdmin.from(
      "component_code",
    ).select("*").eq("id", code_id).single();

    const code = codeData.code;
    const component_id = codeData.component_id;

    await page.setContent(formatCode(code), {
      waitUntil: "networkidle2",
    });

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
  }
};
