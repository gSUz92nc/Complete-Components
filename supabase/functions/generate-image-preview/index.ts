// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/v135/@supabase/functions-js@2.3.1/src/edge-runtime.d.ts" />
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3"

const browser = await puppeteer.launch();
const page = await browser.newPage();
page.setViewport({ width: 896, height: 1344 });


function formatCode(code: string) {
  // Add <script src="/tailwind.js"></script>
  let formattedCode = `<head><script src="https://cdn.tailwindcss.com"></script></head>`;
  // Add the code
  formattedCode += `<div class="flex justify-center items-center h-full bg-gray-900">`;
  formattedCode += code;
  formattedCode += `</div>`;

  console.log(formattedCode);
  return formattedCode;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_KEY") || ""
)


Deno.serve(async (req) => {

  const body = await req.json();

  const code_id = body.code_id;

  const { data: codeData, error: codeError } = await supabase.from("component_code").select("*").eq("id", code_id).single();

  const code = codeData.code;
  const component_id = codeData.component_id;
  

  await page.setContent(formatCode(code), {
    waitUntil: "networkidle2",
  });

  const image = await page?.screenshot({
    encoding: "base64",
  });

  // Upload the image to a storage bucket
  const { data, error } = await supabase.storage.from("code_previews").upload(`${component_id}/image.png`, image, {
    contentType: "image/png",
  });

  if (error) {
    console.error("Error uploading image", error);
    return new Response(
      JSON.stringify({ error: "Error uploading image" }),
      { status: 500 },
    )
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-image-preview' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
