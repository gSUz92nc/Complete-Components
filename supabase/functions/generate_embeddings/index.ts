// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/v135/@supabase/functions-js@2.3.1/src/edge-runtime.d.ts" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

const session = new Supabase.ai.Session("gte-small");

async function generateEmbeddings(input: string) {
  const embed = await session.run(input, {
    mean_pool: true,
    normalize: true,
  });
  console.log("Embeddings generated!");

  return embed;
}

Deno.serve(async (_req) => {

  const client = createClient(
    "https://wrnmfdfizduyptqsvbnm.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indybm1mZGZpemR1eXB0cXN2Ym5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyODUyMDIsImV4cCI6MjAyODg2MTIwMn0.1oFSY8SuvfBB8wkY7OoKNRiQYw9E0w8OjBODoQdcZQk",
  );

  const embeddings = [];

  // Generate the embedding for each data.function
  for (const func of data.functions) {
    console.log(`Generating embedding for ${func.title}`);

    const description_embedding = await generateEmbeddings(
      func.description || "",
    );
    const examples_embedding = await generateEmbeddings(
      JSON.stringify(func.examples),
    );

    console.log("Processing embeddings...");

    // Upload the embeddings to the database
    const { error } = await client.from("js_embeddings").upsert({
      title: func.title || "",
      description: func.description || "",
      examples: JSON.stringify(func.examples) || "",
      description_embedding,
      examples_embedding,
    });

    if (error) {
      console.error(error.message);
      console.error(error.details);
    }
  }

  console.log(data.functions.length);

  // Return the embedding
  return new Response(
    JSON.stringify({ done: true }),
    { headers: { "Content-Type": "application/json" } },
  );
});
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate_embeddings' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

const data = {
  "functions": [
    {
      "id": "initializing",
      "title": "Initializing",
      "$ref": "@supabase/supabase-js.index.SupabaseClient.constructor",
      "description":
        "You can initialize a new Supabase client using the `createClient()` method.\n\nThe Supabase client is your entrypoint to the rest of the Supabase functionality\nand is the easiest way to interact with everything we offer within the Supabase ecosystem.\n",
      "examples": [
        {
          "id": "create-client",
          "name": "Creating a client",
          "code":
            "```js\nimport { createClient } from '@supabase/supabase-js'\n\n// Create a single supabase client for interacting with your database\nconst supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')\n```\n",
        },
        {
          "id": "with-custom-domain",
          "name": "With a custom domain",
          "code":
            "```js\nimport { createClient } from '@supabase/supabase-js'\n\n// Use a custom domain as the supabase URL\nconst supabase = createClient('https://my-custom-domain.com', 'public-anon-key')\n```\n",
        },
        {
          "id": "with-additional-parameters",
          "name": "With additional parameters",
          "code":
            "```js\nimport { createClient } from '@supabase/supabase-js'\n\nconst options = {\n  db: {\n    schema: 'public',\n  },\n  auth: {\n    autoRefreshToken: true,\n    persistSession: true,\n    detectSessionInUrl: true\n  },\n  global: {\n    headers: { 'x-my-custom-header': 'my-app-name' },\n  },\n}\nconst supabase = createClient(\"https://xyzcompany.supabase.co\", \"public-anon-key\", options)\n```\n",
        },
        {
          "id": "api-schemas",
          "name": "With custom schemas",
          "code":
            "```js\nimport { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key', {\n  // Provide a custom schema. Defaults to \"public\".\n  db: { schema: 'other_schema' }\n})\n```\n",
          "description":
            "By default the API server points to the `public` schema. You can enable other database schemas within the Dashboard.\nGo to [Settings > API > Exposed schemas](/dashboard/project/_/settings/api) and add the schema which you want to expose to the API.\n\nNote: each client connection can only access a single schema, so the code above can access the `other_schema` schema but cannot access the `public` schema.\n",
        },
        {
          "id": "custom-fetch-implementation",
          "name": "Custom fetch implementation",
          "code":
            "```js\nimport { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key', {\n  global: { fetch: fetch.bind(globalThis) }\n})\n```\n",
          "description":
            "`supabase-js` uses the [`cross-fetch`](https://www.npmjs.com/package/cross-fetch) library to make HTTP requests,\nbut an alternative `fetch` implementation can be provided as an option.\nThis is most useful in environments where `cross-fetch` is not compatible (for instance Cloudflare Workers).\n",
        },
        {
          "id": "react-native-options-async-storage",
          "name": "React Native options with AsyncStorage",
          "code":
            '```js\nimport \'react-native-url-polyfill/auto\'\nimport { createClient } from \'@supabase/supabase-js\'\nimport AsyncStorage from "@react-native-async-storage/async-storage";\n\nconst supabase = createClient("https://xyzcompany.supabase.co", "public-anon-key", {\n  auth: {\n    storage: AsyncStorage,\n    autoRefreshToken: true,\n    persistSession: true,\n    detectSessionInUrl: false,\n  },\n});\n```\n',
          "description":
            "For React Native we recommend using `AsyncStorage` as the storage implementation for Supabase Auth.\n",
        },
        {
          "id": "react-native-options-secure-storage",
          "name": "React Native options with Expo SecureStore",
          "code":
            "```js\nimport 'react-native-url-polyfill/auto'\nimport { createClient } from '@supabase/supabase-js'\nimport AsyncStorage from '@react-native-async-storage/async-storage';\nimport * as SecureStore from 'expo-secure-store';\nimport * as aesjs from 'aes-js';\nimport 'react-native-get-random-values';\n\n// As Expo's SecureStore does not support values larger than 2048\n// bytes, an AES-256 key is generated and stored in SecureStore, while\n// it is used to encrypt/decrypt values stored in AsyncStorage.\nclass LargeSecureStore {\n  private async _encrypt(key: string, value: string) {\n    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));\n\n    const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));\n    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));\n\n    await SecureStore.setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey));\n\n    return aesjs.utils.hex.fromBytes(encryptedBytes);\n  }\n\n  private async _decrypt(key: string, value: string) {\n    const encryptionKeyHex = await SecureStore.getItemAsync(key);\n    if (!encryptionKeyHex) {\n      return encryptionKeyHex;\n    }\n\n    const cipher = new aesjs.ModeOfOperation.ctr(aesjs.utils.hex.toBytes(encryptionKeyHex), new aesjs.Counter(1));\n    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));\n\n    return aesjs.utils.utf8.fromBytes(decryptedBytes);\n  }\n\n  async getItem(key: string) {\n    const encrypted = await AsyncStorage.getItem(key);\n    if (!encrypted) { return encrypted; }\n\n    return await this._decrypt(key, encrypted);\n  }\n\n  async removeItem(key: string) {\n    await AsyncStorage.removeItem(key);\n    await SecureStore.deleteItemAsync(key);\n  }\n\n  async setItem(key: string, value: string) {\n    const encrypted = await this._encrypt(key, value);\n\n    await AsyncStorage.setItem(key, encrypted);\n  }\n}\n\nconst supabase = createClient(\"https://xyzcompany.supabase.co\", \"public-anon-key\", {\n  auth: {\n    storage: new LargeSecureStore(),\n    autoRefreshToken: true,\n    persistSession: true,\n    detectSessionInUrl: false,\n  },\n});\n```\n",
          "description":
            "If you wish to encrypt the user's session information, you can use `aes-js` and store the encryption key in Expo SecureStore. The `aes-js` library, a reputable JavaScript-only implementation of the AES encryption algorithm in CTR mode. A new 256-bit encryption key is generated using the `react-native-get-random-values` library. This key is stored inside Expo's SecureStore, while the value is encrypted and placed inside AsyncStorage.\n\nPlease make sure that:\n- You keep the `expo-secure-storage`, `aes-js` and `react-native-get-random-values` libraries up-to-date.\n- Choose the correct [`SecureStoreOptions`](https://docs.expo.dev/versions/latest/sdk/securestore/#securestoreoptions) for your app's needs. E.g. [`SecureStore.WHEN_UNLOCKED`](https://docs.expo.dev/versions/latest/sdk/securestore/#securestorewhen_unlocked) regulates when the data can be accessed.\n- Carefully consider optimizations or other modifications to the above example, as those can lead to introducing subtle security vulnerabilities.\n",
        },
      ],
    },
    {
      "id": "auth-api",
      "title": "Overview",
      "notes":
        "- The auth methods can be accessed via the `supabase.auth` namespace.\n- By default, the supabase client sets `persistSession` to true and attempts to store the session in local storage. When using the supabase client in an environment that doesn't support local storage, you might notice the following warning message being logged:\n\n  > No storage option exists to persist the session, which may result in unexpected behavior when using auth. If you want to set `persistSession` to true, please provide a storage option or you may set `persistSession` to false to disable this warning.\n\n  This warning message can be safely ignored if you're not using auth on the server-side. If you are using auth and you want to set `persistSession` to true, you will need to provide a custom storage implementation that follows [this interface](https://github.com/supabase/gotrue-js/blob/master/src/lib/types.ts#L1027).\n- Any email links and one-time passwords (OTPs) sent have a default expiry of 24 hours. We have the following [rate limits](/docs/guides/platform/going-into-prod#auth-rate-limits) in place to guard against brute force attacks.\n- The expiry of an access token can be set in the \"JWT expiry limit\" field in [your project's auth settings](/dashboard/project/_/settings/auth). A refresh token never expires and can only be used once.\n",
      "examples": [
        {
          "id": "create-auth-client",
          "name": "Create auth client",
          "isSpotlight": true,
          "code":
            "```js\nimport { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(supabase_url, anon_key)\n```\n",
        },
        {
          "id": "create-auth-client-server-side",
          "name": "Create auth client (server-side)",
          "isSpotlight": false,
          "code":
            "```js\nimport { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(supabase_url, anon_key, {\n  auth: {\n    autoRefreshToken: false,\n    persistSession: false,\n    detectSessionInUrl: false\n  }\n})\n```\n",
        },
      ],
    },
    {
      "id": "sign-up",
      "title": "signUp()",
      "$ref": "@supabase/auth-js.GoTrueClient.signUp",
      "notes":
        "- By default, the user needs to verify their email address before logging in. To turn this off, disable **Confirm email** in [your project](/dashboard/project/_/auth/providers).\n- **Confirm email** determines if users need to confirm their email address after signing up.\n  - If **Confirm email** is enabled, a `user` is returned but `session` is null.\n  - If **Confirm email** is disabled, both a `user` and a `session` are returned.\n- When the user confirms their email address, they are redirected to the [`SITE_URL`](/docs/guides/auth/concepts/redirect-urls) by default. You can modify your `SITE_URL` or add additional redirect URLs in [your project](/dashboard/project/_/auth/url-configuration).\n- If signUp() is called for an existing confirmed user:\n  - When both **Confirm email** and **Confirm phone** (even when phone provider is disabled) are enabled in [your project](/dashboard/project/_/auth/providers), an obfuscated/fake user object is returned.\n  - When either **Confirm email** or **Confirm phone** (even when phone provider is disabled) is disabled, the error message, `User already registered` is returned.\n- To fetch the currently logged-in user, refer to [`getUser()`](/docs/reference/javascript/auth-getuser).\n",
      "examples": [
        {
          "id": "sign-up",
          "name": "Sign up with an email and password",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.signUp({\n  email: 'example@email.com',\n  password: 'example-password',\n})\n```\n",
        },
        {
          "id": "sign-up-phone",
          "name": "Sign up with a phone number and password (SMS)",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.signUp({\n  phone: '123456789',\n  password: 'example-password',\n  options: {\n    channel: 'sms'\n  }\n})\n```\n",
        },
        {
          "id": "sign-up-phone-whatsapp",
          "name": "Sign up with a phone number and password (whatsapp)",
          "isSpotlight": true,
          "description":
            "The user will be sent a WhatsApp message which contains a OTP. By default, a given user can only request a OTP once every 60 seconds. Note that a user will need to have a valid WhatsApp account that is linked to Twilio in order to use this feature.\n",
          "code":
            "```js\nconst { data, error } = await supabase.auth.signUp({\n  phone: '123456789',\n  password: 'example-password',\n  options: {\n    channel: 'whatsapp'\n  }\n})\n```\n",
        },
        {
          "id": "sign-up-with-additional-user-metadata",
          "name": "Sign up with additional user metadata",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.signUp(\n  {\n    email: 'example@email.com',\n    password: 'example-password',\n    options: {\n      data: {\n        first_name: 'John',\n        age: 27,\n      }\n    }\n  }\n)\n```\n",
        },
        {
          "id": "sign-up-with-redirect",
          "name": "Sign up with a redirect URL",
          "description":
            "- See [redirect URLs and wildcards](/docs/guides/auth#redirect-urls-and-wildcards) to add additional redirect URLs to your project.\n",
          "code":
            "```js\nconst { data, error } = await supabase.auth.signUp(\n  {\n    email: 'example@email.com',\n    password: 'example-password',\n    options: {\n      emailRedirectTo: 'https://example.com/welcome'\n    }\n  }\n)\n```\n",
        },
      ],
    },
    {
      "id": "on-auth-state-change",
      "title": "onAuthStateChange()",
      "$ref": "@supabase/auth-js.GoTrueClient.onAuthStateChange",
      "notes":
        "- Subscribes to important events occurring on the user's session.\n- Use on the frontend/client. It is less useful on the server.\n- Events are emitted across tabs to keep your application's UI up-to-date. Some events can fire very frequently, based on the number of tabs open. Use a quick and efficient callback function, and defer or debounce as many operations as you can to be performed outside of the callback.\n- **Important:** A callback can be an `async` function and it runs synchronously during the processing of the changes causing the event. You can easily create a dead-lock by using `await` on a call to another method of the Supabase library.\n  - Avoid using `async` functions as callbacks.\n  - Limit the number of `await` calls in `async` callbacks.\n  - Do not use other Supabase functions in the callback function. If you must, dispatch the functions once the callback has finished executing. Use this as a quick way to achieve this:\n    ```js\n    supabase.auth.onAuthStateChange((event, session) => {\n      setTimeout(async () => {\n        // await on other Supabase function here\n        // this runs right after the callback has finished\n      }, 0)\n    })\n    ```\n- Emitted events:\n  - `INITIAL_SESSION`\n    - Emitted right after the Supabase client is constructed and the initial session from storage is loaded.\n  - `SIGNED_IN`\n    - Emitted each time a user session is confirmed or re-established, including on user sign in and when refocusing a tab. \n    - Avoid making assumptions as to when this event is fired, this may occur even when the user is already signed in. Instead, check the user object attached to the event to see if a new user has signed in and update your application's UI.\n    - This event can fire very frequently depending on the number of tabs open in your application.\n  - `SIGNED_OUT`\n    - Emitted when the user signs out. This can be after:\n      - A call to `supabase.auth.signOut()`.\n      - After the user's session has expired for any reason:\n        - User has signed out on another device.\n        - The session has reached its timebox limit or inactivity timeout.\n        - User has signed in on another device with single session per user enabled.\n        - Check the [User Sessions](/docs/guides/auth/sessions) docs for more information.\n    - Use this to clean up any local storage your application has associated with the user.\n  - `TOKEN_REFRESHED`\n    - Emitted each time a new access and refresh token are fetched for the signed in user.\n    - It's best practice and highly recommended to extract the access token (JWT) and store it in memory for further use in your application.\n      - Avoid frequent calls to `supabase.auth.getSession()` for the same purpose.\n    - There is a background process that keeps track of when the session should be refreshed so you will always receive valid tokens by listening to this event.\n    - The frequency of this event is related to the JWT expiry limit configured on your project.\n  - `USER_UPDATED`\n    - Emitted each time the `supabase.auth.updateUser()` method finishes successfully. Listen to it to update your application's UI based on new profile information.\n  - `PASSWORD_RECOVERY`\n    - Emitted instead of the `SIGNED_IN` event when the user lands on a page that includes a password recovery link in the URL.\n    - Use it to show a UI to the user where they can [reset their password](/docs/guides/auth/passwords#resetting-a-users-password-forgot-password).\n",
      "examples": [
        {
          "id": "listen-to-auth-changes",
          "name": "Listen to auth changes",
          "isSpotlight": true,
          "code":
            "```js\nconst { data } = supabase.auth.onAuthStateChange((event, session) => {\n  console.log(event, session)\n\n  if (event === 'INITIAL_SESSION') {\n    // handle initial session\n  } else if (event === 'SIGNED_IN') {\n    // handle sign in event\n  } else if (event === 'SIGNED_OUT') {\n    // handle sign out event\n  } else if (event === 'PASSWORD_RECOVERY') {\n    // handle password recovery event\n  } else if (event === 'TOKEN_REFRESHED') {\n    // handle token refreshed event\n  } else if (event === 'USER_UPDATED') {\n    // handle user updated event\n  }\n})\n\n// call unsubscribe to remove the callback\ndata.subscription.unsubscribe()\n```\n",
        },
        {
          "id": "listen-to-sign-out",
          "name": "Listen to sign out",
          "description":
            "Make sure you clear out any local data, such as local and session storage, after the client library has detected the user's sign out.\n",
          "code":
            "```js\nsupabase.auth.onAuthStateChange((event, session) => {\n  if (event === 'SIGNED_OUT') {\n    console.log('SIGNED_OUT', session)\n\n    // clear local and session storage\n    [\n      window.localStorage,\n      window.sessionStorage,\n    ].forEach((storage) => {\n      Object.entries(storage)\n        .forEach(([key]) => {\n          storage.removeItem(key)\n        })\n    })\n  }\n})\n```\n",
        },
        {
          "id": "store-provider-tokens",
          "name": "Store OAuth provider tokens on sign in",
          "description":
            "When using [OAuth (Social Login)](/docs/guides/auth/social-login) you sometimes wish to get access to the provider's access token and refresh token, in order to call provider APIs in the name of the user.\n\nFor example, if you are using [Sign in with Google](/docs/guides/auth/social-login/auth-google) you may want to use the provider token to call Google APIs on behalf of the user. Supabase Auth does not keep track of the provider access and refresh token, but does return them for you once, immediately after sign in. You can use the `onAuthStateChange` method to listen for the presence of the provider tokens and store them in local storage. You can further send them to your server's APIs for use on the backend.\n\nFinally, make sure you remove them from local storage on the `SIGNED_OUT` event. If the OAuth provider supports token revocation, make sure you call those APIs either from the frontend or schedule them to be called on the backend.\n",
          "code":
            "```js\n// Register this immediately after calling createClient!\n// Because signInWithOAuth causes a redirect, you need to fetch the\n// provider tokens from the callback.\nsupabase.auth.onAuthStateChange((event, session) => {\n  if (session && session.provider_token) {\n    window.localStorage.setItem('oauth_provider_token', session.provider_token)\n  }\n\n  if (session && session.provider_refresh_token) {\n    window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)\n  }\n\n  if (event === 'SIGNED_OUT') {\n    window.localStorage.removeItem('oauth_provider_token')\n    window.localStorage.removeItem('oauth_provider_refresh_token')\n  }\n})\n```\n",
        },
        {
          "id": "react-user-session-context",
          "name": "Use React Context for the User's session",
          "description":
            "Instead of relying on `supabase.auth.getSession()` within your React components, you can use a [React Context](https://react.dev/reference/react/createContext) to store the latest session information from the `onAuthStateChange` callback and access it that way.\n",
          "code":
            "```js\nconst SessionContext = React.createContext(null)\n\nfunction main() {\n  const [session, setSession] = React.useState(null)\n\n  React.useEffect(() => {\n    const subscription = supabase.auth.onAuthStateChange(\n      (event, session) => {\n        if (event === 'SIGNED_OUT') {\n          setSession(null)\n        } else if (session) {\n          setSession(session)\n        }\n      })\n\n    return () => {\n      subscription.unsubscribe()\n    }\n  }, [])\n\n  return (\n    <SessionContext.Provider value={session}>\n      <App />\n    </SessionContext.Provider>\n  )\n}\n```\n",
        },
        {
          "id": "listen-to-password-recovery-events",
          "name": "Listen to password recovery events",
          "code":
            "```js\nsupabase.auth.onAuthStateChange((event, session) => {\n  if (event === 'PASSWORD_RECOVERY') {\n    console.log('PASSWORD_RECOVERY', session)\n    // show screen to update user's password\n    showPasswordResetScreen(true)\n  }\n})\n```\n",
        },
        {
          "id": "listen-to-sign-in",
          "name": "Listen to sign in",
          "code":
            "```js\nsupabase.auth.onAuthStateChange((event, session) => {\n  if (event === 'SIGNED_IN') console.log('SIGNED_IN', session)\n})\n```\n",
        },
        {
          "id": "listen-to-token-refresh",
          "name": "Listen to token refresh",
          "code":
            "```js\nsupabase.auth.onAuthStateChange((event, session) => {\n  if (event === 'TOKEN_REFRESHED') console.log('TOKEN_REFRESHED', session)\n})\n```\n",
        },
        {
          "id": "listen-to-user-updates",
          "name": "Listen to user updates",
          "code":
            "```js\nsupabase.auth.onAuthStateChange((event, session) => {\n  if (event === 'USER_UPDATED') console.log('USER_UPDATED', session)\n})\n```\n",
        },
      ],
    },
    {
      "id": "sign-in-anonymously",
      "title": "signInAnonymously()",
      "$ref": "@supabase/auth-js.GoTrueClient.signInAnonymously",
      "notes":
        "- Returns an anonymous user\n- It is recommended to set up captcha for anonymous sign-ins to prevent abuse. You can pass in the captcha token in the `options` param.\n",
      "examples": [
        {
          "id": "sign-in-anonymously",
          "name": "Create an anonymous user",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInAnonymously({\n  options: {\n    captchaToken\n  }\n});\n```\n",
        },
        {
          "id": "sign-in-anonymously-with-user-metadata",
          "name": "Create an anonymous user with custom user metadata",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInAnonymously({\n  options: {\n    data\n  }\n})\n```\n",
        },
      ],
    },
    {
      "id": "sign-in-with-password",
      "title": "signInWithPassword()",
      "$ref": "@supabase/auth-js.GoTrueClient.signInWithPassword",
      "notes":
        "- Requires either an email and password or a phone number and password.\n",
      "examples": [
        {
          "id": "sign-in-with-email-and-password",
          "name": "Sign in with email and password",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInWithPassword({\n  email: 'example@email.com',\n  password: 'example-password',\n})\n```\n",
        },
        {
          "id": "sign-in-with-phone-and-password",
          "name": "Sign in with phone and password",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInWithPassword({\n  phone: '+13334445555',\n  password: 'some-password',\n})\n```\n",
        },
      ],
    },
    {
      "id": "sign-in-with-otp",
      "title": "signInWithOtp()",
      "$ref": "@supabase/auth-js.GoTrueClient.signInWithOtp",
      "notes":
        "- Requires either an email or phone number.\n- This method is used for passwordless sign-ins where a OTP is sent to the user's email or phone number.\n- If the user doesn't exist, `signInWithOtp()` will signup the user instead. To restrict this behavior, you can set `shouldCreateUser` in `SignInWithPasswordlessCredentials.options` to `false`.\n- If you're using an email, you can configure whether you want the user to receive a magiclink or a OTP.\n- If you're using phone, you can configure whether you want the user to receive a OTP.\n- The magic link's destination URL is determined by the [`SITE_URL`](/docs/guides/auth/concepts/redirect-urls).\n- See [redirect URLs and wildcards](/docs/guides/auth#redirect-urls-and-wildcards) to add additional redirect URLs to your project.\n- Magic links and OTPs share the same implementation. To send users a one-time code instead of a magic link, [modify the magic link email template](/dashboard/project/_/auth/templates) to include `{{ .Token }}` instead of `{{ .ConfirmationURL }}`.\n- See our [Twilio Phone Auth Guide](/docs/guides/auth/phone-login/twilio) for details about configuring WhatsApp sign in.\n",
      "examples": [
        {
          "id": "sign-in-with-email",
          "name": "Sign in with email",
          "isSpotlight": true,
          "description":
            "The user will be sent an email which contains either a magiclink or a OTP or both. By default, a given user can only request a OTP once every 60 seconds.",
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInWithOtp({\n  email: 'example@email.com',\n  options: {\n    emailRedirectTo: 'https://example.com/welcome'\n  }\n})\n```\n",
        },
        {
          "id": "sign-in-with-sms-otp",
          "name": "Sign in with SMS OTP",
          "isSpotlight": false,
          "description":
            "The user will be sent a SMS which contains a OTP. By default, a given user can only request a OTP once every 60 seconds.",
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInWithOtp({\n  phone: '+13334445555',\n})\n```\n",
        },
        {
          "id": "sign-in-with-whatsapp-otp",
          "name": "Sign in with WhatsApp OTP",
          "isSpotlight": false,
          "description":
            "The user will be sent a WhatsApp message which contains a OTP. By default, a given user can only request a OTP once every 60 seconds. Note that a user will need to have a valid WhatsApp account that is linked to Twilio in order to use this feature.",
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInWithOtp({\n  phone: '+13334445555',\n  options: {\n    channel:'whatsapp',\n  }\n})\n```\n",
        },
      ],
    },
    {
      "id": "sign-in-with-oauth",
      "title": "signInWithOAuth()",
      "$ref": "@supabase/auth-js.GoTrueClient.signInWithOAuth",
      "notes":
        "- This method is used for signing in using a third-party provider.\n- Supabase supports many different [third-party providers](/docs/guides/auth#configure-third-party-providers).\n",
      "examples": [
        {
          "id": "sign-in-using-a-third-party-provider",
          "name": "Sign in using a third-party provider",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInWithOAuth({\n  provider: 'github'\n})\n```\n",
        },
        {
          "id": "sign-in-using-a-third-party-provider-with-redirect",
          "name": "Sign in using a third-party provider with redirect",
          "isSpotlight": false,
          "description":
            "- When the third-party provider successfully authenticates the user, the provider redirects the user to the URL specified in the `redirectTo` parameter. This parameter defaults to the [`SITE_URL`](/docs/guides/auth/concepts/redirect-urls). It does not redirect the user immediately after invoking this method.\n- See [redirect URLs and wildcards](/docs/guides/auth#redirect-urls-and-wildcards) to add additional redirect URLs to your project.\n",
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInWithOAuth({\n  provider: 'github',\n  options: {\n    redirectTo: 'https://example.com/welcome'\n  }\n})\n```\n",
        },
        {
          "id": "sign-in-with-scopes",
          "name": "Sign in with scopes and access provider tokens",
          "isSpotlight": false,
          "description":
            "If you need additional access from an OAuth provider, in order to access provider specific APIs in the name of the user, you can do this by passing in the scopes the user should authorize for your application. Note that the `scopes` option takes in **a space-separated list** of scopes.\n\nBecause OAuth sign-in often includes redirects, you should register an `onAuthStateChange` callback immediately after you create the Supabase client. This callback will listen for the presence of `provider_token` and `provider_refresh_token` properties on the `session` object and store them in local storage. The client library will emit these values **only once** immediately after the user signs in. You can then access them by looking them up in local storage, or send them to your backend servers for further processing.\n\nFinally, make sure you remove them from local storage on the `SIGNED_OUT` event. If the OAuth provider supports token revocation, make sure you call those APIs either from the frontend or schedule them to be called on the backend.\n",
          "code":
            "```js\n// Register this immediately after calling createClient!\n// Because signInWithOAuth causes a redirect, you need to fetch the\n// provider tokens from the callback.\nsupabase.auth.onAuthStateChange((event, session) => {\n  if (session && session.provider_token) {\n    window.localStorage.setItem('oauth_provider_token', session.provider_token)\n  }\n\n  if (session && session.provider_refresh_token) {\n    window.localStorage.setItem('oauth_provider_refresh_token', session.provider_refresh_token)\n  }\n\n  if (event === 'SIGNED_OUT') {\n    window.localStorage.removeItem('oauth_provider_token')\n    window.localStorage.removeItem('oauth_provider_refresh_token')\n  }\n})\n\n// Call this on your Sign in with GitHub button to initiate OAuth\n// with GitHub with the requested elevated scopes.\nawait supabase.auth.signInWithOAuth({\n  provider: 'github',\n  options: {\n    scopes: 'repo gist notifications'\n  }\n})\n```\n",
        },
      ],
    },
    {
      "id": "sign-in-with-id-token",
      "title": "signInWithIdToken",
      "$ref": "@supabase/auth-js.GoTrueClient.signInWithIdToken",
      "examples": [
        {
          "id": "sign-in-with-id-token",
          "name": "Sign In using ID Token",
          "code":
            "```js\nconst { data, error } = await supabase.auth.signInWithIdToken({\n  provider: 'google',\n  token: 'your-id-token'\n})\n```\n",
        },
      ],
    },
    {
      "id": "sign-in-with-sso",
      "title": "signInWithSSO()",
      "$ref": "@supabase/auth-js.GoTrueClient.signInWithSSO",
      "notes":
        "- Before you can call this method you need to [establish a connection](/docs/guides/auth/sso/auth-sso-saml#managing-saml-20-connections) to an identity provider. Use the [CLI commands](/docs/reference/cli/supabase-sso) to do this.\n- If you've associated an email domain to the identity provider, you can use the `domain` property to start a sign-in flow.\n- In case you need to use a different way to start the authentication flow with an identity provider, you can use the `providerId` property. For example:\n    - Mapping specific user email addresses with an identity provider.\n    - Using different hints to identity the identity provider to be used by the user, like a company-specific page, IP address or other tracking information.\n",
      "examples": [
        {
          "id": "sign-in-with-domain",
          "name": "Sign in with email domain",
          "isSpotlight": true,
          "code":
            "```js\n  // You can extract the user's email domain and use it to trigger the\n  // authentication flow with the correct identity provider.\n\n  const { data, error } = await supabase.auth.signInWithSSO({\n    domain: 'company.com'\n  })\n\n  if (data?.url) {\n    // redirect the user to the identity provider's authentication flow\n    window.location.href = data.url\n  }\n```\n",
        },
        {
          "id": "sign-in-with-provider-uuid",
          "name": "Sign in with provider UUID",
          "isSpotlight": true,
          "code":
            "```js\n  // Useful when you need to map a user's sign in request according\n  // to different rules that can't use email domains.\n\n  const { data, error } = await supabase.auth.signInWithSSO({\n    providerId: '21648a9d-8d5a-4555-a9d1-d6375dc14e92'\n  })\n\n  if (data?.url) {\n    // redirect the user to the identity provider's authentication flow\n    window.location.href = data.url\n  }\n```\n",
        },
      ],
    },
    {
      "id": "sign-out",
      "title": "signOut()",
      "$ref": "@supabase/auth-js.GoTrueClient.signOut",
      "notes":
        "- In order to use the `signOut()` method, the user needs to be signed in first.\n- By default, `signOut()` uses the global scope, which signs out all other sessions that the user is logged into as well.\n- Since Supabase Auth uses JWTs for authentication, the access token JWT will be valid until it's expired. When the user signs out, Supabase revokes the refresh token and deletes the JWT from the client-side. This does not revoke the JWT and it will still be valid until it expires.\n",
      "examples": [
        {
          "id": "sign-out",
          "name": "Sign out",
          "isSpotlight": true,
          "code":
            "```js\nconst { error } = await supabase.auth.signOut()\n```\n",
        },
      ],
    },
    {
      "id": "verify-otp",
      "title": "verifyOtp()",
      "$ref": "@supabase/auth-js.GoTrueClient.verifyOtp",
      "notes":
        "- The `verifyOtp` method takes in different verification types. If a phone number is used, the type can either be `sms` or `phone_change`. If an email address is used, the type can be one of the following: `email`, `recovery`, `invite` or `email_change` (`signup` and `magiclink` types are deprecated).\n- The verification type used should be determined based on the corresponding auth method called before `verifyOtp` to sign up / sign-in a user.\n- The `TokenHash` is contained in the [email templates](/docs/guides/auth/auth-email-templates) and can be used to sign in. You may wish to use the hash with Magic Links for the PKCE flow for Server Side Auth. See [this guide](/docs/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr) for more details.\n",
      "examples": [
        {
          "id": "verify-sms-one-time-password(otp)",
          "name": "Verify Sms One-Time Password (OTP)",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms'})\n```\n",
        },
        {
          "id": "verify-signup-one-time-password(otp)",
          "name": "Verify Signup One-Time Password (OTP)",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email'})\n```\n",
        },
        {
          "id": "verify-email-auth(tokenhash)",
          "name": "Verify Email Auth (Token Hash)",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'email'})\n```\n",
        },
      ],
    },
    {
      "id": "get-session",
      "title": "getSession()",
      "$ref": "@supabase/auth-js.GoTrueClient.getSession",
      "notes":
        "- This method retrieves the current local session (i.e local storage).\n- The session contains a signed JWT and unencoded session data.\n- Since the unencoded session data is retrieved from the local storage medium, **do not** rely on it as a source of trusted data on the server. It could be tampered with by the sender. If you need verified, trustworthy user data, call [`getUser`](/docs/reference/javascript/auth-getuser) instead.\n- If the session has an expired access token, this method will use the refresh token to get a new session.\n",
      "examples": [
        {
          "id": "get-the-session-data",
          "name": "Get the session data",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.getSession()\n```\n",
        },
      ],
    },
    {
      "id": "start-auto-refresh",
      "title": "startAutoRefresh()",
      "$ref": "@supabase/auth-js.GoTrueClient.startAutoRefresh",
      "notes":
        "- Only useful in non-browser environments such as React Native or Electron.\n- The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.\n- On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is _focused_ or not.\n- To give this hint to the application, you should be calling this method when the app is in focus and calling `supabase.auth.stopAutoRefresh()` when it's out of focus.\n",
      "examples": [
        {
          "id": "start-stop-auto-refresh-react-native",
          "name": "Start and stop auto refresh in React Native",
          "isSpotlight": true,
          "code":
            "```js\nimport { AppState } from 'react-native'\n\n// make sure you register this only once!\nAppState.addEventListener('change', (state) => {\n  if (state === 'active') {\n    supabase.auth.startAutoRefresh()\n  } else {\n    supabase.auth.stopAutoRefresh()\n  }\n})\n```\n",
        },
      ],
    },
    {
      "id": "stop-auto-refresh",
      "title": "stopAutoRefresh()",
      "$ref": "@supabase/auth-js.GoTrueClient.stopAutoRefresh",
      "notes":
        "- Only useful in non-browser environments such as React Native or Electron.\n- The Supabase Auth library automatically starts and stops proactively refreshing the session when a tab is focused or not.\n- On non-browser platforms, such as mobile or desktop apps built with web technologies, the library is not able to effectively determine whether the application is _focused_ or not.\n- When your application goes in the background or out of focus, call this method to stop the proactive refreshing of the session.\n",
      "examples": [
        {
          "id": "start-stop-auto-refresh-react-native",
          "name": "Start and stop auto refresh in React Native",
          "isSpotlight": true,
          "code":
            "```js\nimport { AppState } from 'react-native'\n\n// make sure you register this only once!\nAppState.addEventListener('change', (state) => {\n  if (state === 'active') {\n    supabase.auth.startAutoRefresh()\n  } else {\n    supabase.auth.stopAutoRefresh()\n  }\n})\n```\n",
        },
      ],
    },
    {
      "id": "get-user",
      "title": "getUser()",
      "$ref": "@supabase/auth-js.GoTrueClient.getUser",
      "notes":
        "- This method fetches the user object from the database instead of local session.\n- This method is useful for checking if the user is authorized because it validates the user's access token JWT on the server.\n- Should always be used when checking for user authorization on the server. On the client, you can instead use `getSession().session.user` for faster results. `getSession` is insecure on the server.\n",
      "examples": [
        {
          "id": "get-the-logged-in-user-with-the-current-existing-session",
          "name": "Get the logged in user with the current existing session",
          "isSpotlight": true,
          "code":
            "```js\nconst { data: { user } } = await supabase.auth.getUser()\n```\n",
        },
        {
          "id": "get-the-logged-in-user-with-a-custom-access-token-jwt",
          "name": "Get the logged in user with a custom access token jwt",
          "isSpotlight": false,
          "code":
            "```js\nconst { data: { user } } = await supabase.auth.getUser(jwt)\n```\n",
        },
      ],
    },
    {
      "id": "update-user",
      "title": "updateUser()",
      "$ref": "@supabase/auth-js.GoTrueClient.updateUser",
      "notes":
        "- In order to use the `updateUser()` method, the user needs to be signed in first.\n- By default, email updates sends a confirmation link to both the user's current and new email.\nTo only send a confirmation link to the user's new email, disable **Secure email change** in your project's [email auth provider settings](/dashboard/project/_/auth/providers).\n",
      "examples": [
        {
          "id": "update-the-email-for-an-authenticated-user",
          "name": "Update the email for an authenticated user",
          "description":
            'Sends a "Confirm Email Change" email to the new email address.',
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.updateUser({\n  email: 'new@email.com'\n})\n```\n",
        },
        {
          "id": "update-the-phone-for-an-authenticated-user",
          "name": "Update the phone number for an authenticated user",
          "description":
            "Sends a one-time password (OTP) to the new phone number.",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.updateUser({\n  phone: '123456789'\n})\n```\n",
        },
        {
          "id": "update-the-password-for-an-authenticated-user",
          "name": "Update the password for an authenticated user",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.updateUser({\n  password: 'new password'\n})\n```\n",
        },
        {
          "id": "update-the-users-metadata",
          "name": "Update the user's metadata",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.updateUser({\n  data: { hello: 'world' }\n})\n```\n",
        },
        {
          "id": "update-password-with-reauthentication",
          "name": "Update the user's password with a nonce",
          "description":
            "If **Secure password change** is enabled in your [project's email provider settings](/dashboard/project/_/auth/providers), updating the user's password would require a nonce if the user **hasn't recently signed in**. The nonce is sent to the user's email or phone number. A user is deemed recently signed in if the session was created in the last 24 hours.\n",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.updateUser({\n  password: 'new password',\n  nonce: '123456'\n})\n```\n",
        },
      ],
    },
    {
      "id": "get-user-identities",
      "title": "getUserIdentities()",
      "$ref": "@supabase/auth-js.GoTrueClient.getUserIdentities",
      "notes":
        "- The user needs to be signed in to call `getUserIdentities()`.\n",
      "examples": [
        {
          "id": "get-user-identities",
          "name": "Returns a list of identities linked to the user",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.getUserIdentities()\n```\n",
        },
      ],
    },
    {
      "id": "link-identity",
      "title": "linkIdentity()",
      "$ref": "@supabase/auth-js.GoTrueClient.linkIdentity",
      "notes":
        "- The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/settings/auth).\n- The user needs to be signed in to call `linkIdentity()`.\n- If the candidate identity is already linked to the existing user or another user, `linkIdentity()` will fail.\n",
      "examples": [
        {
          "id": "link-identity",
          "name": "Link an identity to a user",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.linkIdentity()\n```\n",
        },
      ],
    },
    {
      "id": "unlink-identity",
      "title": "unlinkIdentity()",
      "$ref": "@supabase/auth-js.GoTrueClient.unlinkIdentity",
      "notes":
        "- The **Enable Manual Linking** option must be enabled from your [project's authentication settings](/dashboard/project/_/settings/auth).\n- The user needs to be signed in to call `unlinkIdentity()`.\n- The user must have at least 2 identities in order to unlink an identity.\n- The identity to be unlinked must belong to the user.\n",
      "examples": [
        {
          "id": "unlink-identity",
          "name": "Unlink an identity",
          "isSpotlight": true,
          "code":
            "```js\n// retrieve all identites linked to a user\nconst identities = await supabase.auth.getUserIdentities()\n\n// find the google identity \nconst googleIdentity = identities.find(\n  identity => identity.provider === 'google'\n)\n\n// unlink the google identity\nconst { data, error } = await supabase.auth.unlinkIdentity(googleIdentity)\n```\n",
        },
      ],
    },
    {
      "id": "send-password-reauthentication",
      "title": "reauthenticate()",
      "$ref": "@supabase/auth-js.GoTrueClient.reauthenticate",
      "notes":
        "- This method is used together with `updateUser()` when a user's password needs to be updated.\n- If you require your user to reauthenticate before updating their password, you need to enable the **Secure password change** option in your [project's email provider settings](/dashboard/project/_/auth/providers).\n- A user is only require to reauthenticate before updating their password if **Secure password change** is enabled and the user **hasn't recently signed in**. A user is deemed recently signed in if the session was created in the last 24 hours.\n- This method will send a nonce to the user's email. If the user doesn't have a confirmed email address, the method will send the nonce to the user's confirmed phone number instead.\n",
      "examples": [
        {
          "id": "send-reauthentication-nonce",
          "name": "Send reauthentication nonce",
          "description":
            "Sends a reauthentication nonce to the user's email or phone number.",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.reauthenticate()\n```\n",
        },
      ],
    },
    {
      "id": "resend-email-or-phone-otps",
      "title": "resend()",
      "$ref": "@supabase/auth-js.GoTrueClient.resend",
      "notes":
        "- Resends a signup confirmation, email change or phone change email to the user.\n- Passwordless sign-ins can be resent by calling the `signInWithOtp()` method again.\n- Password recovery emails can be resent by calling the `resetPasswordForEmail()` method again.\n- This method will only resend an email or phone OTP to the user if there was an initial signup, email change or phone change request being made.\n- You can specify a redirect url when you resend an email link using the `emailRedirectTo` option.\n",
      "examples": [
        {
          "id": "resend-email-signup-confirmation",
          "name": "Resend an email signup confirmation",
          "description": "Resends the email signup confirmation to the user",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.resend({\n  type: 'signup',\n  email: 'email@example.com',\n  options: {\n    emailRedirectTo: 'https://example.com/welcome'\n  }\n})\n```\n",
        },
        {
          "id": "resend-phone-signup-confirmation",
          "name": "Resend a phone signup confirmation",
          "description":
            "Resends the phone signup confirmation email to the user",
          "code":
            "```js\nconst { data, error } = await supabase.auth.resend({\n  type: 'sms',\n  phone: '1234567890'\n})\n```\n",
        },
        {
          "id": "resend-email-change-email",
          "name": "Resend email change email",
          "description": "Resends the email change email to the user",
          "code":
            "```js\nconst { data, error } = await supabase.auth.resend({\n  type: 'email_change',\n  email: 'email@example.com'\n})\n```\n",
        },
        {
          "id": "resend-phone-change",
          "name": "Resend phone change OTP",
          "description": "Resends the phone change OTP to the user",
          "code":
            "```js\nconst { data, error } = await supabase.auth.resend({\n  type: 'phone_change',\n  phone: '1234567890'\n})\n```\n",
        },
      ],
    },
    {
      "id": "set-session",
      "title": "setSession()",
      "$ref": "@supabase/auth-js.GoTrueClient.setSession",
      "notes":
        "- `setSession()` takes in a refresh token and uses it to get a new session.\n- The refresh token can only be used once to obtain a new session.\n- [Refresh token rotation](/docs/reference/auth/config#refresh_token_rotation_enabled) is enabled by default on all projects to guard against replay attacks.\n- You can configure the [`REFRESH_TOKEN_REUSE_INTERVAL`](/docs/reference/auth/config#refresh_token_reuse_interval) which provides a short window in which the same refresh token can be used multiple times in the event of concurrency or offline issues.\n",
      "examples": [
        {
          "id": "refresh-the-session",
          "name": "Refresh the session",
          "description":
            "Sets the session data from refresh_token and returns current session or an error if the refresh_token is invalid.",
          "isSpotlight": true,
          "code":
            "```js\n  const { data, error } = await supabase.auth.setSession({\n    access_token,\n    refresh_token\n  })\n```\n",
        },
      ],
    },
    {
      "id": "refresh-session",
      "title": "refreshSession()",
      "$ref": "@supabase/auth-js.GoTrueClient.refreshSession",
      "notes":
        "- This method will refresh and return a new session whether the current one is expired or not.\n",
      "examples": [
        {
          "id": "refresh-session-using-the-current-session",
          "name": "Refresh session using the current session",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.refreshSession()\nconst { session, user } = data\n```\n",
        },
        {
          "id": "refresh-session-using-a-passed-in-session",
          "name": "Refresh session using a refresh token",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.refreshSession({ refresh_token })\nconst { session, user } = data\n```\n",
        },
      ],
    },
    {
      "id": "exchange-code-for-session",
      "title": "exchangeCodeForSession()",
      "$ref": "@supabase/auth-js.GoTrueClient.exchangeCodeForSession",
      "notes": "- Used when `flowType` is set to `pkce` in client options.\n",
      "examples": [
        {
          "id": "exchange-auth-code",
          "name": "Exchange Auth Code",
          "isSpotlight": true,
          "code":
            "```js\nsupabase.auth.exchangeCodeForSession('34e770dd-9ff9-416c-87fa-43b31d7ef225')\n```\n",
        },
      ],
    },
    {
      "id": "auth-mfa-api",
      "title": "Overview",
      "notes":
        "This section contains methods commonly used for Multi-Factor Authentication (MFA) and are invoked behind the `supabase.auth.mfa` namespace.\n\nCurrently, we only support time-based one-time password (TOTP) as the 2nd factor. We don't support recovery codes but we allow users to enroll more than 1 TOTP factor, with an upper limit of 10.\n\nHaving a 2nd TOTP factor for recovery frees the user of the burden of having to store their recovery codes somewhere. It also reduces the attack surface since multiple recovery codes are usually generated compared to just having 1 backup TOTP factor.\n",
    },
    {
      "id": "mfa-enroll",
      "title": "mfa.enroll()",
      "$ref": "@supabase/auth-js.GoTrueMFAApi.enroll",
      "notes":
        '- Currently, `totp` is the only supported `factorType`. The returned `id` should be used to create a challenge.\n- To create a challenge, see [`mfa.challenge()`](/docs/reference/javascript/auth-mfa-challenge).\n- To verify a challenge, see [`mfa.verify()`](/docs/reference/javascript/auth-mfa-verify).\n- To create and verify a challenge in a single step, see [`mfa.challengeAndVerify()`](/docs/reference/javascript/auth-mfa-challengeandverify).\n- To generate a QR code for the `totp` secret in nextjs, you can do the following:\n```html\n<Image src={data.totp.qr_code} alt={data.totp.uri} layout="fill"></Image>\n```\n',
      "examples": [
        {
          "id": "enroll-totp-factor",
          "name": "Enroll a time-based, one-time password (TOTP) factor",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.mfa.enroll({\n  factorType: 'totp',\n  friendlyName: 'your_friendly_name'\n})\n\n// Use the id to create a challenge.\n// The challenge can be verified by entering the code generated from the authenticator app.\n// The code will be generated upon scanning the qr_code or entering the secret into the authenticator app.\nconst { id, type, totp: { qr_code, secret, uri }, friendly_name } = data\n```\n",
        },
      ],
    },
    {
      "id": "mfa-challenge",
      "title": "mfa.challenge()",
      "$ref": "@supabase/auth-js.GoTrueMFAApi.challenge",
      "notes":
        "- An [enrolled factor](/docs/reference/javascript/auth-mfa-enroll) is required before creating a challenge.\n- To verify a challenge, see [`mfa.verify()`](/docs/reference/javascript/auth-mfa-verify).\n",
      "examples": [
        {
          "id": "create-mfa-challenge",
          "name": "Create a challenge for a factor",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.mfa.challenge({\n  factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225'\n})\n```\n",
        },
      ],
    },
    {
      "id": "mfa-verify",
      "title": "mfa.verify()",
      "$ref": "@supabase/auth-js.GoTrueMFAApi.verify",
      "notes":
        "- To verify a challenge, please [create a challenge](/docs/reference/javascript/auth-mfa-challenge) first.\n",
      "examples": [
        {
          "id": "verify-challenge",
          "name": "Verify a challenge for a factor",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.mfa.verify({\n  factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225',\n  challengeId: '4034ae6f-a8ce-4fb5-8ee5-69a5863a7c15',\n  code: '123456'\n})\n```\n",
        },
      ],
    },
    {
      "id": "mfa-challenge-and-verify",
      "title": "mfa.challengeAndVerify()",
      "$ref": "@supabase/auth-js.GoTrueMFAApi.challengeAndVerify",
      "notes":
        "- An [enrolled factor](/docs/reference/javascript/auth-mfa-enroll) is required before invoking `challengeAndVerify()`.\n- Executes [`mfa.challenge()`](/docs/reference/javascript/auth-mfa-challenge) and [`mfa.verify()`](/docs/reference/javascript/auth-mfa-verify) in a single step.\n",
      "examples": [
        {
          "id": "challenge-and-verify",
          "name": "Create and verify a challenge for a factor",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.mfa.challengeAndVerify({\n  factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225',\n  code: '123456'\n})\n```\n",
        },
      ],
    },
    {
      "id": "mfa-unenroll",
      "title": "mfa.unenroll()",
      "$ref": "@supabase/auth-js.GoTrueMFAApi.unenroll",
      "examples": [
        {
          "id": "unenroll-a-factor",
          "name": "Unenroll a factor",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.mfa.unenroll({\n  factorId: '34e770dd-9ff9-416c-87fa-43b31d7ef225',\n})\n```\n",
        },
      ],
    },
    {
      "id": "mfa-get-authenticator-assurance-level",
      "title": "mfa.getAuthenticatorAssuranceLevel()",
      "$ref": "@supabase/auth-js.GoTrueMFAApi.getAuthenticatorAssuranceLevel",
      "notes":
        "- Authenticator Assurance Level (AAL) is the measure of the strength of an authentication mechanism.\n- In Supabase, having an AAL of `aal1` refers to having the 1st factor of authentication such as an email and password or OAuth sign-in while `aal2` refers to the 2nd factor of authentication such as a time-based, one-time-password (TOTP).\n- If the user has a verified factor, the `nextLevel` field will return `aal2`, else, it will return `aal1`.\n",
      "examples": [
        {
          "id": "get-aal",
          "name": "Get the AAL details of a session",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()\nconst { currentLevel, nextLevel, currentAuthenticationMethods } = data\n```\n",
        },
      ],
    },
    {
      "id": "admin-api",
      "title": "Overview",
      "notes":
        "- Any method under the `supabase.auth.admin` namespace requires a `service_role` key.\n- These methods are considered admin methods and should be called on a trusted server. Never expose your `service_role` key in the browser.\n",
      "examples": [
        {
          "id": "create-auth-admin-client",
          "name": "Create server-side auth client",
          "isSpotlight": true,
          "code":
            "```js\nimport { createClient } from '@supabase/supabase-js'\n\nconst supabase = createClient(supabase_url, service_role_key, {\n  auth: {\n    autoRefreshToken: false,\n    persistSession: false\n  }\n})\n\n// Access auth admin api\nconst adminAuthClient = supabase.auth.admin\n```\n",
        },
      ],
    },
    {
      "id": "get-user-by-id",
      "title": "getUserById()",
      "$ref": "@supabase/auth-js.GoTrueAdminApi.getUserById",
      "notes":
        "- Fetches the user object from the database based on the user's id.\n- The `getUserById()` method requires the user's id which maps to the `auth.users.id` column.\n",
      "examples": [
        {
          "id": "fetch-the-user-object-using-the-access-token-jwt",
          "name": "Fetch the user object using the access_token jwt",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.getUserById(1)\n```\n",
        },
      ],
    },
    {
      "id": "list-users",
      "title": "listUsers()",
      "$ref": "@supabase/auth-js.GoTrueAdminApi.listUsers",
      "notes": "- Defaults to return 50 users per page.\n",
      "examples": [
        {
          "id": "get-a-full-list-of-users",
          "name": "Get a page of users",
          "isSpotlight": true,
          "code":
            "```js\nconst { data: { users }, error } = await supabase.auth.admin.listUsers()\n```\n",
        },
        {
          "id": "get-paginated-list-of-users",
          "name": "Paginated list of users",
          "isSpotlight": false,
          "code":
            "```js\nconst { data: { users }, error } = await supabase.auth.admin.listUsers({\n  page: 1,\n  perPage: 1000\n})\n```\n",
        },
      ],
    },
    {
      "id": "create-user",
      "title": "createUser()",
      "$ref": "@supabase/auth-js.GoTrueAdminApi.createUser",
      "notes":
        "- To confirm the user's email address or phone number, set `email_confirm` or `phone_confirm` to true. Both arguments default to false.\n- `createUser()` will not send a confirmation email to the user. You can use [`inviteUserByEmail()`](/docs/reference/javascript/auth-admin-inviteuserbyemail) if you want to send them an email invite instead.\n- If you are sure that the created user's email or phone number is legitimate and verified, you can set the `email_confirm` or `phone_confirm` param to `true`.\n",
      "examples": [
        {
          "id": "create-a-new-user-with-custom-user-metadata",
          "name": "With custom user metadata",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.createUser({\n  email: 'user@email.com',\n  password: 'password',\n  user_metadata: { name: 'Yoda' }\n})\n```\n",
        },
        {
          "id": "auto-confirm-the-users-email",
          "name": "Auto-confirm the user's email",
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.createUser({\n  email: 'user@email.com',\n  email_confirm: true\n})\n```\n",
        },
        {
          "id": "auto-confirm-the-users-phone-number",
          "name": "Auto-confirm the user's phone number",
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.createUser({\n  phone: '1234567890',\n  phone_confirm: true\n})\n```\n",
        },
      ],
    },
    {
      "id": "delete-user",
      "title": "deleteUser()",
      "$ref": "@supabase/auth-js.GoTrueAdminApi.deleteUser",
      "notes":
        "- The `deleteUser()` method requires the user's ID, which maps to the `auth.users.id` column.\n",
      "examples": [
        {
          "id": "removes-a-user",
          "name": "Removes a user",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.deleteUser(\n  '715ed5db-f090-4b8c-a067-640ecee36aa0'\n)\n```\n",
        },
      ],
    },
    {
      "id": "invite-user-by-email",
      "title": "inviteUserByEmail()",
      "$ref": "@supabase/auth-js.GoTrueAdminApi.inviteUserByEmail",
      "notes":
        "- Sends an invite link to the user's email address.\n- The `inviteUserByEmail()` method is typically used by administrators to invite users to join the application.\n- Note that PKCE is not supported when using `inviteUserByEmail`. This is because the browser initiating the invite is often different from the browser accepting the invite which makes it difficult to provide the security guarantees required of the PKCE flow.\n",
      "examples": [
        {
          "id": "invite-a-user",
          "name": "Invite a user",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.inviteUserByEmail('email@example.com')\n```\n",
        },
      ],
    },
    {
      "id": "reset-password-for-email",
      "title": "resetPasswordForEmail()",
      "$ref": "@supabase/auth-js.GoTrueClient.resetPasswordForEmail",
      "notes":
        "- The password reset flow consist of 2 broad steps: (i) Allow the user to login via the password reset link; (ii) Update the user's password.\n- The `resetPasswordForEmail()` only sends a password reset link to the user's email.\nTo update the user's password, see [`updateUser()`](/docs/reference/javascript/auth-updateuser).\n- A `SIGNED_IN` and `PASSWORD_RECOVERY` event will be emitted when the password recovery link is clicked.\nYou can use [`onAuthStateChange()`](/docs/reference/javascript/auth-onauthstatechange) to listen and invoke a callback function on these events.\n- When the user clicks the reset link in the email they are redirected back to your application.\nYou can configure the URL that the user is redirected to with the `redirectTo` parameter.\nSee [redirect URLs and wildcards](/docs/guides/auth#redirect-urls-and-wildcards) to add additional redirect URLs to your project.\n- After the user has been redirected successfully, prompt them for a new password and call `updateUser()`:\n```js\nconst { data, error } = await supabase.auth.updateUser({\n  password: new_password\n})\n```\n",
      "examples": [
        {
          "id": "reset-password",
          "name": "Reset password",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.resetPasswordForEmail(email, {\n  redirectTo: 'https://example.com/update-password',\n})\n```\n",
        },
        {
          "id": "reset-password-react",
          "name": "Reset password (React)",
          "isSpotlight": true,
          "code":
            '```js\n/**\n * Step 1: Send the user an email to get a password reset token.\n * This email contains a link which sends the user back to your application.\n */\nconst { data, error } = await supabase.auth\n  .resetPasswordForEmail(\'user@email.com\')\n\n/**\n * Step 2: Once the user is redirected back to your application,\n * ask the user to reset their password.\n */\n useEffect(() => {\n   supabase.auth.onAuthStateChange(async (event, session) => {\n     if (event == "PASSWORD_RECOVERY") {\n       const newPassword = prompt("What would you like your new password to be?");\n       const { data, error } = await supabase.auth\n         .updateUser({ password: newPassword })\n\n       if (data) alert("Password updated successfully!")\n       if (error) alert("There was an error updating your password.")\n     }\n   })\n }, [])\n```\n',
        },
      ],
    },
    {
      "id": "generate-link",
      "title": "generateLink()",
      "$ref": "@supabase/auth-js.GoTrueAdminApi.generateLink",
      "notes":
        "- The following types can be passed into `generateLink()`: `signup`, `magiclink`, `invite`, `recovery`, `email_change_current`, `email_change_new`, `phone_change`.\n- `generateLink()` only generates the email link for `email_change_email` if the **Secure email change** is enabled in your project's [email auth provider settings](/dashboard/project/_/auth/providers).\n- `generateLink()` handles the creation of the user for `signup`, `invite` and `magiclink`.\n",
      "examples": [
        {
          "id": "generate-a-signup-link",
          "name": "Generate a signup link",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.generateLink({\n  type: 'signup',\n  email: 'email@example.com',\n  password: 'secret'\n})\n```\n",
        },
        {
          "id": "generate-an-invite-link",
          "name": "Generate an invite link",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.generateLink({\n  type: 'invite',\n  email: 'email@example.com'\n})\n```\n",
        },
        {
          "id": "generate-a-magic-link",
          "name": "Generate a magic link",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.generateLink({\n  type: 'magiclink',\n  email: 'email@example.com'\n})\n```\n",
        },
        {
          "id": "generate-a-recovery-link",
          "name": "Generate a recovery link",
          "isSpotlight": false,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.generateLink({\n  type: 'recovery',\n  email: 'email@example.com'\n})\n```\n",
        },
        {
          "id": "generate-links-to-change-current-email-address",
          "name": "Generate links to change current email address",
          "isSpotlight": false,
          "code":
            "```js\n// generate an email change link to be sent to the current email address\nconst { data, error } = await supabase.auth.admin.generateLink({\n  type: 'email_change_current',\n  email: 'current.email@example.com',\n  newEmail: 'new.email@example.com'\n})\n\n// generate an email change link to be sent to the new email address\nconst { data, error } = await supabase.auth.admin.generateLink({\n  type: 'email_change_new',\n  email: 'current.email@example.com',\n  newEmail: 'new.email@example.com'\n})\n```\n",
        },
      ],
    },
    {
      "id": "update-user-by-id",
      "title": "updateUserById()",
      "$ref": "@supabase/auth-js.GoTrueAdminApi.updateUserById",
      "examples": [
        {
          "id": "updates-a-users-email",
          "name": "Updates a user's email",
          "isSpotlight": false,
          "code":
            "```js\nconst { data: user, error } = await supabase.auth.admin.updateUserById(\n  '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',\n  { email: 'new@email.com' }\n)\n```\n",
        },
        {
          "id": "updates-a-users-password",
          "name": "Updates a user's password",
          "isSpotlight": false,
          "code":
            "```js\nconst { data: user, error } = await supabase.auth.admin.updateUserById(\n  '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',\n  { password: 'new_password' }\n)\n```\n",
        },
        {
          "id": "updates-a-users-metadata",
          "name": "Updates a user's metadata",
          "isSpotlight": true,
          "code":
            "```js\nconst { data: user, error } = await supabase.auth.admin.updateUserById(\n  '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',\n  { user_metadata: { hello: 'world' } }\n)\n```\n",
        },
        {
          "id": "updates-a-users-app-metadata",
          "name": "Updates a user's app_metadata",
          "isSpotlight": false,
          "code":
            "```js\nconst { data: user, error } = await supabase.auth.admin.updateUserById(\n  '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',\n  { app_metadata: { plan: 'trial' } }\n)\n```\n",
        },
        {
          "id": "confirms-a-users-email-address",
          "name": "Confirms a user's email address",
          "isSpotlight": false,
          "code":
            "```js\nconst { data: user, error } = await supabase.auth.admin.updateUserById(\n  '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',\n  { email_confirm: true }\n)\n```\n",
        },
        {
          "id": "confirms-a-users-phone-number",
          "name": "Confirms a user's phone number",
          "isSpotlight": false,
          "code":
            "```js\nconst { data: user, error } = await supabase.auth.admin.updateUserById(\n  '6aa5d0d4-2a9f-4483-b6c8-0cf4c6c98ac4',\n  { phone_confirm: true }\n)\n```\n",
        },
      ],
    },
    {
      "id": "mfa-list-factors",
      "title": "mfa.listFactors()",
      "$ref": "@supabase/auth-js.GoTrueAdminMFAApi.listFactors",
      "examples": [
        {
          "id": "list-factors",
          "name": "List all factors for a user",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.mfa.listFactors()\n```\n",
        },
      ],
    },
    {
      "id": "mfa-delete-factor",
      "title": "mfa.deleteFactor()",
      "$ref": "@supabase/auth-js.GoTrueAdminMFAApi.deleteFactor",
      "examples": [
        {
          "id": "delete-factor",
          "name": "Delete a factor for a user",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.auth.admin.mfa.deleteFactor({\n  id: '34e770dd-9ff9-416c-87fa-43b31d7ef225',\n  userId: 'a89baba7-b1b7-440f-b4bb-91026967f66b',\n})\n```\n",
        },
      ],
    },
    {
      "id": "select",
      "title": "Fetch data: select()",
      "$ref": "@supabase/postgrest-js.PostgrestQueryBuilder.select",
      "notes":
        "- By default, Supabase projects return a maximum of 1,000 rows. This setting can be changed in your project's [API settings](/dashboard/project/_/settings/api). It's recommended that you keep it low to limit the payload size of accidental or malicious requests. You can use `range()` queries to paginate through your data.\n- `select()` can be combined with [Filters](/docs/reference/javascript/using-filters)\n- `select()` can be combined with [Modifiers](/docs/reference/javascript/using-modifiers)\n- `apikey` is a reserved keyword if you're using the [Supabase Platform](/docs/guides/platform) and [should be avoided as a column name](https://github.com/supabase/supabase/issues/5465).\n",
      "examples": [
        {
          "id": "getting-your-data",
          "name": "Getting your data",
          "code":
            "```js\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Afghanistan"\n    },\n    {\n      "id": 2,\n      "name": "Albania"\n    },\n    {\n      "id": 3,\n      "name": "Algeria"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
        },
        {
          "id": "selecting-specific-columns",
          "name": "Selecting specific columns",
          "code":
            "```js\nconst { data, error } = await supabase\n  .from('countries')\n  .select('name')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Afghanistan"\n    },\n    {\n      "name": "Albania"\n    },\n    {\n      "name": "Algeria"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
        },
        {
          "id": "query-referenced-tables",
          "name": "Query referenced tables",
          "description":
            "If your database has foreign key relationships, you can query related tables too.\n",
          "code":
            "```js\nconst { data, error } = await supabase\n  .from('countries')\n  .select(`\n    name,\n    cities (\n      name\n    )\n  `)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\ncreate table\n  cities (\n    id int8 primary key,\n    country_id int8 not null references countries,\n    name text\n  );\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Germany'),\n  (2, 'Indonesia');\ninsert into\n  cities (id, country_id, name)\nvalues\n  (1, 2, 'Bali'),\n  (2, 1, 'Munich');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Germany",\n      "cities": [\n        {\n          "name": "Munich"\n        }\n      ]\n    },\n    {\n      "name": "Indonesia",\n      "cities": [\n        {\n          "name": "Bali"\n        }\n      ]\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
        },
        {
          "id": "query-referenced-tables-through-a-join-table",
          "name": "Query referenced tables through a join table",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('users')\n  .select(`\n    name,\n    teams (\n      name\n    )\n  `)\n  ```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  users (\n    id int8 primary key,\n    name text\n  );\ncreate table\n  teams (\n    id int8 primary key,\n    name text\n  );\n-- join table\ncreate table\n  users_teams (\n    user_id int8 not null references users,\n    team_id int8 not null references teams,\n    -- both foreign keys must be part of a composite primary key\n    primary key (user_id, team_id)\n  );\n\ninsert into\n  users (id, name)\nvalues\n  (1, 'Kiran'),\n  (2, 'Evan');\ninsert into\n  teams (id, name)\nvalues\n  (1, 'Green'),\n  (2, 'Blue');\ninsert into\n  users_teams (user_id, team_id)\nvalues\n  (1, 1),\n  (1, 2),\n  (2, 2);\n```\n",
          },
          "response":
            '```json\n  {\n    "data": [\n      {\n        "name": "Kiran",\n        "teams": [\n          {\n            "name": "Green"\n          },\n          {\n            "name": "Blue"\n          }\n        ]\n      },\n      {\n        "name": "Evan",\n        "teams": [\n          {\n            "name": "Blue"\n          }\n        ]\n      }\n    ],\n    "status": 200,\n    "statusText": "OK"\n  }\n  ```\n',
          "description":
            "If you're in a situation where your tables are **NOT** directly\nrelated, but instead are joined by a _join table_, you can still use\nthe `select()` method to query the related data. The join table needs\nto have the foreign keys as part of its composite primary key.\n",
          "hideCodeBlock": true,
        },
        {
          "id": "query-the-same-referenced-table-multiple-times",
          "name": "Query the same referenced table multiple times",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('messages')\n  .select(`\n    content,\n    from:sender_id(name),\n    to:receiver_id(name)\n  `)\n\n// To infer types, use the name of the table (in this case `users`) and\n// the name of the foreign key constraint.\nconst { data, error } = await supabase\n  .from('messages')\n  .select(`\n    content,\n    from:users!messages_sender_id_fkey(name),\n    to:users!messages_receiver_id_fkey(name)\n  `)\n```\n",
          "data": {
            "sql":
              "```sql\n create table\n users (id int8 primary key, name text);\n\n create table\n   messages (\n     sender_id int8 not null references users,\n     receiver_id int8 not null references users,\n     content text\n   );\n\n insert into\n   users (id, name)\n values\n   (1, 'Kiran'),\n   (2, 'Evan');\n\n insert into\n   messages (sender_id, receiver_id, content)\n values\n   (1, 2, '👋');\n ```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "content": "👋",\n      "from": {\n        "name": "Kiran"\n      },\n      "to": {\n        "name": "Evan"\n      }\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "If you need to query the same referenced table twice, use the name of the\njoined column to identify which join to use. You can also give each\ncolumn an alias.\n",
          "hideCodeBlock": true,
        },
        {
          "id": "filtering-through-referenced-tables",
          "name": "Filtering through referenced tables",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('cities')\n  .select('name, countries(*)')\n  .eq('countries.name', 'Estonia')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\ncreate table\n  cities (\n    id int8 primary key,\n    country_id int8 not null references countries,\n    name text\n  );\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Germany'),\n  (2, 'Indonesia');\ninsert into\n  cities (id, country_id, name)\nvalues\n  (1, 2, 'Bali'),\n  (2, 1, 'Munich');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Bali",\n      "countries": null\n    },\n    {\n      "name": "Munich",\n      "countries": null\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "If the filter on a referenced table's column is not satisfied, the referenced\ntable returns `[]` or `null` but the parent table is not filtered out.\nIf you want to filter out the parent table rows, use the `!inner` hint\n",
          "hideCodeBlock": true,
        },
        {
          "id": "querying-referenced-table-with-count",
          "name": "Querying referenced table with count",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select(`*, cities(count)`)\n```\n",
          "data": {
            "sql":
              '```sql\ncreate table countries (\n  "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,\n  "name" text\n);\n\ncreate table cities (\n  "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,\n  "name" text,\n  "country_id" "uuid" references public.countries on delete cascade\n);\n\nwith country as (\n  insert into countries (name)\n  values (\'united kingdom\') returning id\n)\ninsert into cities (name, country_id) values\n(\'London\', (select id from country)),\n(\'Manchester\', (select id from country)),\n(\'Liverpool\', (select id from country)),\n(\'Bristol\', (select id from country));\n```\n',
          },
          "response":
            '```json\n[\n  {\n    "id": "693694e7-d993-4360-a6d7-6294e325d9b6",\n    "name": "United Kingdom",\n    "cities": [\n      {\n        "count": 4\n      }\n    ]\n  }\n]\n```\n',
          "description":
            "You can get the number of rows in a related table by using the\n**count** property.\n",
          "hideCodeBlock": true,
        },
        {
          "id": "querying-with-count-option",
          "name": "Querying with count option",
          "code":
            "```ts\nconst { count, error } = await supabase\n  .from('countries')\n  .select('*', { count: 'exact', head: true })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "count": 3,\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "You can get the number of rows by using the\n[count](/docs/reference/javascript/select#parameters) option.\n",
          "hideCodeBlock": true,
        },
        {
          "id": "querying-json-data",
          "name": "Querying JSON data",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('users')\n  .select(`\n    id, name,\n    address->city\n  `)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  users (\n    id int8 primary key,\n    name text,\n    address jsonb\n  );\n\ninsert into\n  users (id, name, address)\nvalues\n  (1, 'Avdotya', '{\"city\":\"Saint Petersburg\"}');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Avdotya",\n      "city": "Saint Petersburg"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "You can select and filter data inside of\n[JSON](/docs/guides/database/json) columns. Postgres offers some\n[operators](/docs/guides/database/json#query-the-jsonb-data) for\nquerying JSON data.\n",
          "hideCodeBlock": true,
        },
        {
          "id": "querying-referenced-table-with-inner-join",
          "name": "Querying referenced table with inner join",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('cities')\n  .select('name, countries!inner(name)')\n  .eq('countries.name', 'Indonesia')\n```\n",
          "data": {
            "sql":
              '```sql\ncreate table countries (\n  "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,\n  "name" text\n);\n\ncreate table cities (\n  "id" "uuid" primary key default "extensions"."uuid_generate_v4"() not null,\n  "name" text,\n  "country_id" "uuid" references public.countries on delete cascade\n);\n\nwith country as (\n  insert into countries (name)\n  values (\'united kingdom\') returning id\n)\ninsert into cities (name, country_id) values\n(\'London\', (select id from country)),\n(\'Manchester\', (select id from country)),\n(\'Liverpool\', (select id from country)),\n(\'Bristol\', (select id from country));\n```\n',
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Bali",\n      "countries": {"name": "Indonesia"}\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "If you don't want to return the referenced table contents, you can leave the parenthesis empty.\nLike `.select('name, countries!inner()')`.\n",
          "hideCodeBlock": true,
        },
        {
          "id": "switching-schemas-per-query",
          "name": "Switching schemas per query",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .schema('myschema')\n  .from('mytable')\n  .select()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate schema myschema;\n\ncreate table myschema.mytable (\n  id uuid primary key default gen_random_uuid(),\n  data text\n);\n\ninsert into myschema.mytable (data) values ('mydata');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": "4162e008-27b0-4c0f-82dc-ccaeee9a624d",\n      "data": "mydata"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "In addition to setting the schema during initialization, you can also switch schemas on a per-query basis.\nMake sure you've set up your [database privileges and API settings](/docs/guides/api/using-custom-schemas).\n",
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "insert",
      "title": "Create data: insert()",
      "$ref": "@supabase/postgrest-js.PostgrestQueryBuilder.insert",
      "examples": [
        {
          "id": "create-a-record",
          "name": "Create a record",
          "code":
            "```ts\nconst { error } = await supabase\n  .from('countries')\n  .insert({ id: 1, name: 'Denmark' })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n```\n",
          },
          "response":
            '```json\n{\n  "status": 201,\n  "statusText": "Created"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "create-a-record-and-return-it",
          "name": "Create a record and return it",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .insert({ id: 1, name: 'Denmark' })\n  .select()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Denmark"\n    }\n  ],\n  "status": 201,\n  "statusText": "Created"\n}\n```\n',
          "hideCodeBlock": true,
        },
        {
          "id": "bulk-create",
          "name": "Bulk create",
          "code":
            "```ts\nconst { error } = await supabase\n  .from('countries')\n  .insert([\n    { id: 1, name: 'Nepal' },\n    { id: 1, name: 'Vietnam' },\n  ])\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n```\n",
          },
          "response":
            '```json\n{\n  "error": {\n    "code": "23505",\n    "details": "Key (id)=(1) already exists.",\n    "hint": null,\n    "message": "duplicate key value violates unique constraint \\"countries_pkey\\""\n  },\n  "status": 409,\n  "statusText": "Conflict"\n}\n```\n',
          "description":
            "A bulk create operation is handled in a single transaction.\nIf any of the inserts fail, none of the rows are inserted.\n",
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "update",
      "title": "Modify data: update()",
      "$ref": "@supabase/postgrest-js.PostgrestQueryBuilder.update",
      "notes":
        "- `update()` should always be combined with [Filters](/docs/reference/javascript/using-filters) to target the item(s) you wish to update.\n",
      "examples": [
        {
          "id": "updating-your-data",
          "name": "Updating your data",
          "code":
            "```ts\nconst { error } = await supabase\n  .from('countries')\n  .update({ name: 'Australia' })\n  .eq('id', 1)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Taiwan');\n```\n",
          },
          "response":
            '```json\n{\n  "status": 204,\n  "statusText": "No Content"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "update-a-record-and-return-it",
          "name": "Update a record and return it",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .update({ name: 'Australia' })\n  .eq('id', 1)\n  .select()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Taiwan');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Australia"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
        },
        {
          "id": "updating-json-data",
          "name": "Updating JSON data",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('users')\n  .update({\n    address: {\n      street: 'Melrose Place',\n      postcode: 90210\n    }\n  })\n  .eq('address->postcode', 90210)\n  .select()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  users (\n    id int8 primary key,\n    name text,\n    address jsonb\n  );\n\ninsert into\n  users (id, name, address)\nvalues\n  (1, 'Michael', '{ \"postcode\": 90210 }');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Michael",\n      "address": {\n        "street": "Melrose Place",\n        "postcode": 90210\n      }\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "Postgres offers some\n[operators](/docs/guides/database/json#query-the-jsonb-data) for\nworking with JSON data. Currently, it is only possible to update the entire JSON document.\n",
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "upsert",
      "title": "Upsert data: upsert()",
      "$ref": "@supabase/postgrest-js.PostgrestQueryBuilder.upsert",
      "notes": "- Primary keys must be included in `values` to use upsert.\n",
      "examples": [
        {
          "id": "upsert-your-data",
          "name": "Upsert your data",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .upsert({ id: 1, name: 'Albania' })\n  .select()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Albania"\n    }\n  ],\n  "status": 201,\n  "statusText": "Created"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "bulk-upsert-your-data",
          "name": "Bulk Upsert your data",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .upsert([\n    { id: 1, name: 'Albania' },\n    { id: 2, name: 'Algeria' },\n  ])\n  .select()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Albania"\n    },\n    {\n      "id": 2,\n      "name": "Algeria"\n    }\n  ],\n  "status": 201,\n  "statusText": "Created"\n}\n```\n',
          "hideCodeBlock": true,
        },
        {
          "id": "upserting-into-tables-with-constraints",
          "name": "Upserting into tables with constraints",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('users')\n  .upsert({ id: 42, handle: 'saoirse', display_name: 'Saoirse' }, { onConflict: 'handle' })\n  .select()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  users (\n    id int8 generated by default as identity primary key,\n    handle text not null unique,\n    display_name text\n  );\n\ninsert into\n  users (id, handle, display_name)\nvalues\n  (1, 'saoirse', null);\n```\n",
          },
          "response":
            '```json\n{\n  "error": {\n    "code": "23505",\n    "details": "Key (handle)=(saoirse) already exists.",\n    "hint": null,\n    "message": "duplicate key value violates unique constraint \\"users_handle_key\\""\n  },\n  "status": 409,\n  "statusText": "Conflict"\n}\n```\n',
          "description":
            'In the following query, `upsert()` implicitly uses the `id`\n(primary key) column to determine conflicts. If there is no existing\nrow with the same `id`, `upsert()` inserts a new row, which\nwill fail in this case as there is already a row with `handle` `"saoirse"`.\nUsing the `onConflict` option, you can instruct `upsert()` to use\nanother column with a unique constraint to determine conflicts.\n',
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "delete",
      "title": "Delete data: delete()",
      "$ref": "@supabase/postgrest-js.PostgrestQueryBuilder.delete",
      "notes":
        "- `delete()` should always be combined with [filters](/docs/reference/javascript/using-filters) to target the item(s) you wish to delete.\n- If you use `delete()` with filters and you have\n  [RLS](/docs/learn/auth-deep-dive/auth-row-level-security) enabled, only\n  rows visible through `SELECT` policies are deleted. Note that by default\n  no rows are visible, so you need at least one `SELECT`/`ALL` policy that\n  makes the rows visible.\n",
      "examples": [
        {
          "id": "delete-records",
          "name": "Delete records",
          "code":
            "```ts\nconst { error } = await supabase\n  .from('countries')\n  .delete()\n  .eq('id', 1)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Spain');\n```\n",
          },
          "response":
            '```json\n{\n  "status": 204,\n  "statusText": "No Content"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "rpc",
      "title": "Postgres functions: rpc()",
      "description":
        "You can call Postgres functions as _Remote Procedure Calls_, logic in your database that you can execute from anywhere.\nFunctions are useful when the logic rarely changes—like for password resets and updates.\n\n```sql\ncreate or replace function hello_world() returns text as $$\n  select 'Hello world';\n$$ language sql;\n```\n\nTo call Postgres functions on [Read Replicas](/docs/guides/platform/read-replicas), use the `get: true` option.\n",
      "$ref": "@supabase/postgrest-js.PostgrestClient.rpc",
      "examples": [
        {
          "id": "call-a-postgres-function-without-arguments",
          "name": "Call a Postgres function without arguments",
          "code":
            "```ts\nconst { data, error } = await supabase.rpc('hello_world')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate function hello_world() returns text as $$\n  select 'Hello world';\n$$ language sql;\n```\n",
          },
          "response":
            '```json\n{\n  "data": "Hello world",\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "call-a-postgres-function-with-arguments",
          "name": "Call a Postgres function with arguments",
          "code":
            "```ts\nconst { data, error } = await supabase.rpc('echo', { say: '👋' })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate function echo(say text) returns text as $$\n  select say;\n$$ language sql;\n```\n",
          },
          "response":
            '```json\n  {\n    "data": "👋",\n    "status": 200,\n    "statusText": "OK"\n  }\n  ```\n',
          "hideCodeBlock": true,
        },
        {
          "id": "bulk-processing",
          "name": "Bulk processing",
          "code":
            "```ts\nconst { data, error } = await supabase.rpc('add_one_each', { arr: [1, 2, 3] })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate function add_one_each(arr int[]) returns int[] as $$\n  select array_agg(n + 1) from unnest(arr) as n;\n$$ language sql;\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    2,\n    3,\n    4\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "You can process large payloads by passing in an array as an argument.\n",
          "hideCodeBlock": true,
        },
        {
          "id": "call-a-postgres-function-with-filters",
          "name": "Call a Postgres function with filters",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .rpc('list_stored_countries')\n  .eq('id', 1)\n  .single()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'France'),\n  (2, 'United Kingdom');\n\ncreate function list_stored_countries() returns setof countries as $$\n  select * from countries;\n$$ language sql;\n```\n",
          },
          "response":
            '```json\n{\n  "data": {\n    "id": 1,\n    "name": "France"\n  },\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "Postgres functions that return tables can also be combined with [Filters](/docs/reference/javascript/using-filters) and [Modifiers](/docs/reference/javascript/using-modifiers).\n",
          "hideCodeBlock": true,
        },
        {
          "id": "call-a-read-only-postgres-function",
          "name": "Call a read-only Postgres function",
          "code":
            "```ts\nconst { data, error } = await supabase.rpc('hello_world', { get: true })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate function hello_world() returns text as $$\n  select 'Hello world';\n$$ language sql;\n```\n",
          },
          "response":
            '```json\n{\n  "data": "Hello world",\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "using-filters",
      "title": "Using Filters",
      "description":
        "Filters allow you to only return rows that match certain conditions.\n\nFilters can be used on `select()`, `update()`, `upsert()`, and `delete()` queries.\n\nIf a Postgres function returns a table response, you can also apply filters.\n",
      "examples": [
        {
          "id": "applying-filters",
          "name": "Applying Filters",
          "description":
            "Filters must be applied after any of `select()`, `update()`, `upsert()`,\n`delete()`, and `rpc()` and before\n[modifiers](/docs/reference/javascript/using-modifiers).\n",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('cities')\n  .select('name, country_id')\n  .eq('name', 'The Shire')    // Correct\n\nconst { data, error } = await supabase\n  .from('cities')\n  .eq('name', 'The Shire')    // Incorrect\n  .select('name, country_id')\n```\n",
        },
        {
          "id": "chaining-filters",
          "name": "Chaining",
          "description":
            "Filters can be chained together to produce advanced queries. For example,\nto query cities with population between 1,000 and 10,000:\n\n```ts\nconst { data, error } = await supabase\n  .from('cities')\n  .select('name, country_id')\n  .gte('population', 1000)\n  .lt('population', 10000)\n```\n",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('cities')\n  .select('name, country_id')\n  .gte('population', 1000)\n  .lt('population', 10000)\n```\n",
        },
        {
          "id": "conditional-chaining",
          "name": "Conditional Chaining",
          "description":
            "Filters can be built up one step at a time and then executed. For example:\n\n```ts\nconst filterByName = null\nconst filterPopLow = 1000\nconst filterPopHigh = 10000\n\nlet query = supabase\n  .from('cities')\n  .select('name, country_id')\n\nif (filterByName)  { query = query.eq('name', filterByName) }\nif (filterPopLow)  { query = query.gte('population', filterPopLow) }\nif (filterPopHigh) { query = query.lt('population', filterPopHigh) }\n\nconst { data, error } = await query\n```\n",
          "code":
            "```ts\nconst filterByName = null\nconst filterPopLow = 1000\nconst filterPopHigh = 10000\n\nlet query = supabase\n  .from('cities')\n  .select('name, country_id')\n\nif (filterByName)  { query = query.eq('name', filterByName) }\nif (filterPopLow)  { query = query.gte('population', filterPopLow) }\nif (filterPopHigh) { query = query.lt('population', filterPopHigh) }\n\nconst { data, error } = await query\n```\n",
        },
        {
          "id": "filter-by-value-within-json-column",
          "name": "Filter by values within a JSON column",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('users')\n  .select()\n  .eq('address->postcode', 90210)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  users (\n    id int8 primary key,\n    name text,\n    address jsonb\n  );\n\ninsert into\n  users (id, name, address)\nvalues\n  (1, 'Michael', '{ \"postcode\": 90210 }'),\n  (2, 'Jane', null);\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Michael",\n      "address": {\n        "postcode": 90210\n      }\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
        },
        {
          "id": "filter-referenced-tables",
          "name": "Filter referenced tables",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select(`\n    name,\n    cities!inner (\n      name\n    )\n  `)\n  .eq('cities.name', 'Bali')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\ncreate table\n  cities (\n    id int8 primary key,\n    country_id int8 not null references countries,\n    name text\n  );\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Germany'),\n  (2, 'Indonesia');\ninsert into\n  cities (id, country_id, name)\nvalues\n  (1, 2, 'Bali'),\n  (2, 1, 'Munich');\n```\n",
            "response":
              '```json\n{\n  "data": [\n    {\n      "name": "Indonesia",\n      "cities": [\n        {\n          "name": "Bali"\n        }\n      ]\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          },
          "description":
            "You can filter on referenced tables in your `select()` query using dot\nnotation.\n",
        },
      ],
    },
    {
      "id": "eq",
      "title": "eq()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.eq",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .eq('name', 'Albania')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 2,\n      "name": "Albania"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "neq",
      "title": "neq()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.neq",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .neq('name', 'Albania')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Afghanistan"\n    },\n    {\n      "id": 3,\n      "name": "Algeria"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "gt",
      "title": "gt()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.gt",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .gt('id', 2)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 3,\n      "name": "Algeria"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
          "description":
            "When using [reserved words](https://www.postgresql.org/docs/current/sql-keywords-appendix.html) for column names you need\nto add double quotes e.g. `.gt('\"order\"', 2)`\n",
        },
      ],
    },
    {
      "id": "gte",
      "title": "gte()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.gte",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .gte('id', 2)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 2,\n      "name": "Albania"\n    },\n    {\n      "id": 3,\n      "name": "Algeria"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "lt",
      "title": "lt()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.lt",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .lt('id', 2)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Afghanistan"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "lte",
      "title": "lte()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.lte",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .lte('id', 2)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Afghanistan"\n    },\n    {\n      "id": 2,\n      "name": "Albania"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "like",
      "title": "like()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.like",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .like('name', '%Alba%')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 2,\n      "name": "Albania"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "ilike",
      "title": "ilike()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.ilike",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .ilike('name', '%alba%')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
            "response":
              '```json\n{\n  "data": [\n    {\n      "id": 2,\n      "name": "Albania"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          },
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "is",
      "title": "is()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.is",
      "examples": [
        {
          "id": "checking-nullness",
          "name": "Checking for nullness, true or false",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .is('name', null)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'null'),\n  (2, null);\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "null"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "Using the `eq()` filter doesn't work when filtering for `null`.\n\nInstead, you need to use `is()`.\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "in",
      "title": "in()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.in",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .in('name', ['Albania', 'Algeria'])\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 2,\n      "name": "Albania"\n    },\n    {\n      "id": 3,\n      "name": "Algeria"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "contains",
      "title": "contains()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.contains",
      "examples": [
        {
          "id": "on-array-columns",
          "name": "On array columns",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('issues')\n  .select()\n  .contains('tags', ['is:open', 'priority:low'])\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  issues (\n    id int8 primary key,\n    title text,\n    tags text[]\n  );\n\ninsert into\n  issues (id, title, tags)\nvalues\n  (1, 'Cache invalidation is not working', array['is:open', 'severity:high', 'priority:low']),\n  (2, 'Use better names', array['is:open', 'severity:low', 'priority:medium']);\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "title": "Cache invalidation is not working"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "on-range-columns",
          "name": "On range columns",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('reservations')\n  .select()\n  .contains('during', '[2000-01-01 13:00, 2000-01-01 13:30)')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  reservations (\n    id int8 primary key,\n    room_name text,\n    during tsrange\n  );\n\ninsert into\n  reservations (id, room_name, during)\nvalues\n  (1, 'Emerald', '[2000-01-01 13:00, 2000-01-01 15:00)'),\n  (2, 'Topaz', '[2000-01-02 09:00, 2000-01-02 10:00)');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "room_name": "Emerald",\n      "during": "[\\"2000-01-01 13:00:00\\",\\"2000-01-01 15:00:00\\")"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "Postgres supports a number of [range\ntypes](https://www.postgresql.org/docs/current/rangetypes.html). You\ncan filter on range columns using the string representation of range\nvalues.\n",
          "hideCodeBlock": true,
        },
        {
          "id": "on-jsonb-columns",
          "name": "On `jsonb` columns",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('users')\n  .select('name')\n  .contains('address', { postcode: 90210 })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  users (\n    id int8 primary key,\n    name text,\n    address jsonb\n  );\n\ninsert into\n  users (id, name, address)\nvalues\n  (1, 'Michael', '{ \"postcode\": 90210, \"street\": \"Melrose Place\" }'),\n  (2, 'Jane', '{}');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Michael"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "contained-by",
      "title": "containedBy()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.containedBy",
      "examples": [
        {
          "id": "on-array-columns",
          "name": "On array columns",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('classes')\n  .select('name')\n  .containedBy('days', ['monday', 'tuesday', 'wednesday', 'friday'])\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  classes (\n    id int8 primary key,\n    name text,\n    days text[]\n  );\n\ninsert into\n  classes (id, name, days)\nvalues\n  (1, 'Chemistry', array['monday', 'friday']),\n  (2, 'History', array['monday', 'wednesday', 'thursday']);\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Chemistry"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "on-range-columns",
          "name": "On range columns",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('reservations')\n  .select()\n  .containedBy('during', '[2000-01-01 00:00, 2000-01-01 23:59)')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  reservations (\n    id int8 primary key,\n    room_name text,\n    during tsrange\n  );\n\ninsert into\n  reservations (id, room_name, during)\nvalues\n  (1, 'Emerald', '[2000-01-01 13:00, 2000-01-01 15:00)'),\n  (2, 'Topaz', '[2000-01-02 09:00, 2000-01-02 10:00)');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "room_name": "Emerald",\n      "during": "[\\"2000-01-01 13:00:00\\",\\"2000-01-01 15:00:00\\")"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "Postgres supports a number of [range\ntypes](https://www.postgresql.org/docs/current/rangetypes.html). You\ncan filter on range columns using the string representation of range\nvalues.\n",
          "hideCodeBlock": true,
        },
        {
          "id": "on-jsonb-columns",
          "name": "On `jsonb` columns",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('users')\n  .select('name')\n  .containedBy('address', {})\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  users (\n    id int8 primary key,\n    name text,\n    address jsonb\n  );\n\ninsert into\n  users (id, name, address)\nvalues\n  (1, 'Michael', '{ \"postcode\": 90210, \"street\": \"Melrose Place\" }'),\n  (2, 'Jane', '{}');\n```\n",
          },
          "response":
            '```json\n  {\n    "data": [\n      {\n        "name": "Jane"\n      }\n    ],\n    "status": 200,\n    "statusText": "OK"\n  }\n  ```\n',
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "range-gt",
      "title": "rangeGt()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.rangeGt",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('reservations')\n  .select()\n  .rangeGt('during', '[2000-01-02 08:00, 2000-01-02 09:00)')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  reservations (\n    id int8 primary key,\n    room_name text,\n    during tsrange\n  );\n\ninsert into\n  reservations (id, room_name, during)\nvalues\n  (1, 'Emerald', '[2000-01-01 13:00, 2000-01-01 15:00)'),\n  (2, 'Topaz', '[2000-01-02 09:00, 2000-01-02 10:00)');\n```\n",
          },
          "response":
            '```json\n  {\n    "data": [\n      {\n        "id": 2,\n        "room_name": "Topaz",\n        "during": "[\\"2000-01-02 09:00:00\\",\\"2000-01-02 10:00:00\\")"\n      }\n    ],\n    "status": 200,\n    "statusText": "OK"\n  }\n  ```\n',
          "description":
            "Postgres supports a number of [range\ntypes](https://www.postgresql.org/docs/current/rangetypes.html). You\ncan filter on range columns using the string representation of range\nvalues.\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "range-gte",
      "title": "rangeGte()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.rangeGte",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('reservations')\n  .select()\n  .rangeGte('during', '[2000-01-02 08:30, 2000-01-02 09:30)')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  reservations (\n    id int8 primary key,\n    room_name text,\n    during tsrange\n  );\n\ninsert into\n  reservations (id, room_name, during)\nvalues\n  (1, 'Emerald', '[2000-01-01 13:00, 2000-01-01 15:00)'),\n  (2, 'Topaz', '[2000-01-02 09:00, 2000-01-02 10:00)');\n```\n",
          },
          "response":
            '```json\n  {\n    "data": [\n      {\n        "id": 2,\n        "room_name": "Topaz",\n        "during": "[\\"2000-01-02 09:00:00\\",\\"2000-01-02 10:00:00\\")"\n      }\n    ],\n    "status": 200,\n    "statusText": "OK"\n  }\n  ```\n',
          "description":
            "Postgres supports a number of [range\ntypes](https://www.postgresql.org/docs/current/rangetypes.html). You\ncan filter on range columns using the string representation of range\nvalues.\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "range-lt",
      "title": "rangeLt()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.rangeLt",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('reservations')\n  .select()\n  .rangeLt('during', '[2000-01-01 15:00, 2000-01-01 16:00)')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  reservations (\n    id int8 primary key,\n    room_name text,\n    during tsrange\n  );\n\ninsert into\n  reservations (id, room_name, during)\nvalues\n  (1, 'Emerald', '[2000-01-01 13:00, 2000-01-01 15:00)'),\n  (2, 'Topaz', '[2000-01-02 09:00, 2000-01-02 10:00)');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "room_name": "Emerald",\n      "during": "[\\"2000-01-01 13:00:00\\",\\"2000-01-01 15:00:00\\")"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "Postgres supports a number of [range\ntypes](https://www.postgresql.org/docs/current/rangetypes.html). You\ncan filter on range columns using the string representation of range\nvalues.\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "range-lte",
      "title": "rangeLte()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.rangeLte",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('reservations')\n  .select()\n  .rangeLte('during', '[2000-01-01 14:00, 2000-01-01 16:00)')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  reservations (\n    id int8 primary key,\n    room_name text,\n    during tsrange\n  );\n\ninsert into\n  reservations (id, room_name, during)\nvalues\n  (1, 'Emerald', '[2000-01-01 13:00, 2000-01-01 15:00)'),\n  (2, 'Topaz', '[2000-01-02 09:00, 2000-01-02 10:00)');\n```\n",
          },
          "response":
            '```json\n  {\n    "data": [\n      {\n        "id": 1,\n        "room_name": "Emerald",\n        "during": "[\\"2000-01-01 13:00:00\\",\\"2000-01-01 15:00:00\\")"\n      }\n    ],\n    "status": 200,\n    "statusText": "OK"\n  }\n  ```\n',
          "description":
            "Postgres supports a number of [range\ntypes](https://www.postgresql.org/docs/current/rangetypes.html). You\ncan filter on range columns using the string representation of range\nvalues.\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "range-adjacent",
      "title": "rangeAdjacent()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.rangeAdjacent",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('reservations')\n  .select()\n  .rangeAdjacent('during', '[2000-01-01 12:00, 2000-01-01 13:00)')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  reservations (\n    id int8 primary key,\n    room_name text,\n    during tsrange\n  );\n\ninsert into\n  reservations (id, room_name, during)\nvalues\n  (1, 'Emerald', '[2000-01-01 13:00, 2000-01-01 15:00)'),\n  (2, 'Topaz', '[2000-01-02 09:00, 2000-01-02 10:00)');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "room_name": "Emerald",\n      "during": "[\\"2000-01-01 13:00:00\\",\\"2000-01-01 15:00:00\\")"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "Postgres supports a number of [range\ntypes](https://www.postgresql.org/docs/current/rangetypes.html). You\ncan filter on range columns using the string representation of range\nvalues.\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "overlaps",
      "title": "overlaps()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.overlaps",
      "examples": [
        {
          "id": "on-array-columns",
          "name": "On array columns",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('issues')\n  .select('title')\n  .overlaps('tags', ['is:closed', 'severity:high'])\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  issues (\n    id int8 primary key,\n    title text,\n    tags text[]\n  );\n\ninsert into\n  issues (id, title, tags)\nvalues\n  (1, 'Cache invalidation is not working', array['is:open', 'severity:high', 'priority:low']),\n  (2, 'Use better names', array['is:open', 'severity:low', 'priority:medium']);\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "title": "Cache invalidation is not working"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "on-range-columns",
          "name": "On range columns",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('reservations')\n  .select()\n  .overlaps('during', '[2000-01-01 12:45, 2000-01-01 13:15)')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  reservations (\n    id int8 primary key,\n    room_name text,\n    during tsrange\n  );\n\ninsert into\n  reservations (id, room_name, during)\nvalues\n  (1, 'Emerald', '[2000-01-01 13:00, 2000-01-01 15:00)'),\n  (2, 'Topaz', '[2000-01-02 09:00, 2000-01-02 10:00)');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "room_name": "Emerald",\n      "during": "[\\"2000-01-01 13:00:00\\",\\"2000-01-01 15:00:00\\")"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "Postgres supports a number of [range\ntypes](https://www.postgresql.org/docs/current/rangetypes.html). You\ncan filter on range columns using the string representation of range\nvalues.\n",
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "text-search",
      "title": "textSearch()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.textSearch",
      "notes":
        "- For more information, see [Postgres full text search](/docs/guides/database/full-text-search).\n",
      "examples": [
        {
          "id": "text-search",
          "name": "Text search",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('quotes')\n  .select('catchphrase')\n  .textSearch('catchphrase', `'fat' & 'cat'`, {\n    config: 'english'\n  })\n```\n",
        },
        {
          "id": "basic-normalization",
          "name": "Basic normalization",
          "description": "Uses PostgreSQL's `plainto_tsquery` function.",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('quotes')\n  .select('catchphrase')\n  .textSearch('catchphrase', `'fat' & 'cat'`, {\n    type: 'plain',\n    config: 'english'\n  })\n```\n",
        },
        {
          "id": "full-normalization",
          "name": "Full normalization",
          "description": "Uses PostgreSQL's `phraseto_tsquery` function.",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('quotes')\n  .select('catchphrase')\n  .textSearch('catchphrase', `'fat' & 'cat'`, {\n    type: 'phrase',\n    config: 'english'\n  })\n```\n",
        },
        {
          "id": "web-search",
          "name": "Websearch",
          "description":
            'Uses PostgreSQL\'s `websearch_to_tsquery` function.\nThis function will never raise syntax errors, which makes it possible to use raw user-supplied input for search, and can be used\nwith advanced operators.\n\n- `unquoted text`: text not inside quote marks will be converted to terms separated by & operators, as if processed by plainto_tsquery.\n- `"quoted text"`: text inside quote marks will be converted to terms separated by <-> operators, as if processed by phraseto_tsquery.\n- `OR`: the word “or” will be converted to the | operator.\n- `-`: a dash will be converted to the ! operator.\n',
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('quotes')\n  .select('catchphrase')\n  .textSearch('catchphrase', `'fat or cat'`, {\n    type: 'websearch',\n    config: 'english'\n  })\n```\n",
        },
      ],
    },
    {
      "id": "match",
      "title": "match()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.match",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select('name')\n  .match({ id: 2, name: 'Albania' })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Albania"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "not",
      "title": "not()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.not",
      "notes":
        "not() expects you to use the raw PostgREST syntax for the filter values.\n\n```ts\n.not('id', 'in', '(5,6,7)')  // Use `()` for `in` filter\n.not('arraycol', 'cs', '{\"a\",\"b\"}')  // Use `cs` for `contains()`, `{}` for array values\n```\n",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .not('name', 'is', null)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'null'),\n  (2, null);\n```\n",
          },
          "response":
            '```json\n  {\n    "data": [\n      {\n        "id": 1,\n        "name": "null"\n      }\n    ],\n    "status": 200,\n    "statusText": "OK"\n  }\n  ```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "or",
      "title": "or()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.or",
      "notes":
        'or() expects you to use the raw PostgREST syntax for the filter names and values.\n\n```ts\n.or(\'id.in.(5,6,7), arraycol.cs.{"a","b"}\')  // Use `()` for `in` filter, `{}` for array values and `cs` for `contains()`.\n.or(\'id.in.(5,6,7), arraycol.cd.{"a","b"}\')  // Use `cd` for `containedBy()`\n```\n',
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select('name')\n  .or('id.eq.2,name.eq.Algeria')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Albania"\n    },\n    {\n      "name": "Algeria"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "use-or-with-and",
          "name": "Use `or` with `and`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select('name')\n  .or('id.gt.3,and(id.eq.1,name.eq.Afghanistan)')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "reponse":
            '```json\n{\n  "data": [\n    {\n      "name": "Afghanistan"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
        },
        {
          "id": "use-or-on-referenced-tables",
          "name": "Use `or` on referenced tables",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select(`\n    name,\n    cities!inner (\n      name\n    )\n  `)\n  .or('country_id.eq.1,name.eq.Beijing', { referencedTable: 'cities' })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\ncreate table\n  cities (\n    id int8 primary key,\n    country_id int8 not null references countries,\n    name text\n  );\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Germany'),\n  (2, 'Indonesia');\ninsert into\n  cities (id, country_id, name)\nvalues\n  (1, 2, 'Bali'),\n  (2, 1, 'Munich');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Germany",\n      "cities": [\n        {\n          "name": "Munich"\n        }\n      ]\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "filter",
      "title": "filter()",
      "$ref": "@supabase/postgrest-js.PostgrestFilterBuilder.filter",
      "notes":
        "filter() expects you to use the raw PostgREST syntax for the filter values.\n\n```ts\n.filter('id', 'in', '(5,6,7)')  // Use `()` for `in` filter\n.filter('arraycol', 'cs', '{\"a\",\"b\"}')  // Use `cs` for `contains()`, `{}` for array values\n```\n",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .filter('name', 'in', '(\"Algeria\",\"Japan\")')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 3,\n      "name": "Algeria"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "on-a-referenced-table",
          "name": "On a referenced table",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select(`\n    name,\n    cities!inner (\n      name\n    )\n  `)\n  .filter('cities.name', 'eq', 'Bali')\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\ncreate table\n  cities (\n    id int8 primary key,\n    country_id int8 not null references countries,\n    name text\n  );\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Germany'),\n  (2, 'Indonesia');\ninsert into\n  cities (id, country_id, name)\nvalues\n  (1, 2, 'Bali'),\n  (2, 1, 'Munich');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Indonesia",\n      "cities": [\n        {\n          "name": "Bali"\n        }\n      ]\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "using-modifiers",
      "title": "Using Modifiers",
      "description":
        "Filters work on the row level—they allow you to return rows that\nonly match certain conditions without changing the shape of the rows.\nModifiers are everything that don't fit that definition—allowing you to\nchange the format of the response (e.g., returning a CSV string).\n\nModifiers must be specified after filters. Some modifiers only apply for\nqueries that return rows (e.g., `select()` or `rpc()` on a function that\nreturns a table response).\n",
    },
    {
      "id": "db-modifiers-select",
      "title": "select()",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.select",
      "examples": [
        {
          "id": "with-upsert",
          "name": "With `upsert()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .upsert({ id: 1, name: 'Algeria' })\n  .select()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 1,\n      "name": "Algeria"\n    }\n  ],\n  "status": 201,\n  "statusText": "Created"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "order",
      "title": "order()",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.order",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select('id', 'name')\n  .order('id', { ascending: false })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "id": 3,\n      "name": "Algeria"\n    },\n    {\n      "id": 2,\n      "name": "Albania"\n    },\n    {\n      "id": 1,\n      "name": "Afghanistan"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "on-a-referenced-table",
          "name": "On a referenced table",
          "code":
            "```ts\n  const { data, error } = await supabase\n    .from('countries')\n    .select(`\n      name,\n      cities (\n        name\n      )\n    `)\n    .order('name', { referencedTable: 'cities', ascending: false })\n  ```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\ncreate table\n  cities (\n    id int8 primary key,\n    country_id int8 not null references countries,\n    name text\n  );\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'United States'),\n  (2, 'Vanuatu');\ninsert into\n  cities (id, country_id, name)\nvalues\n  (1, 1, 'Atlanta'),\n  (2, 1, 'New York City');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "United States",\n      "cities": [\n        {\n          "name": "New York City"\n        },\n        {\n          "name": "Atlanta"\n        }\n      ]\n    },\n    {\n      "name": "Vanuatu",\n      "cities": []\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "Ordering on referenced tables doesn't affect the ordering of\nthe parent table.\n",
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "limit",
      "title": "limit()",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.limit",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select('name')\n  .limit(1)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Afghanistan"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "on-a-referenced-table",
          "name": "On a referenced table",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select(`\n    name,\n    cities (\n      name\n    )\n  `)\n  .limit(1, { referencedTable: 'cities' })\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\ncreate table\n  cities (\n    id int8 primary key,\n    country_id int8 not null references countries,\n    name text\n  );\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'United States');\ninsert into\n  cities (id, country_id, name)\nvalues\n  (1, 1, 'Atlanta'),\n  (2, 1, 'New York City');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "United States",\n      "cities": [\n        {\n          "name": "Atlanta"\n        }\n      ]\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
        },
      ],
    },
    {
      "id": "range",
      "title": "range()",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.range",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select('name')\n  .range(0, 1)\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": [\n    {\n      "name": "Afghanistan"\n    },\n    {\n      "name": "Albania"\n    }\n  ],\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "abort-signal",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.abortSignal",
      "title": "abortSignal()",
      "examples": [
        {
          "id": "aborting-requests-in-flight",
          "name": "Aborting requests in-flight",
          "code":
            "```ts\nconst ac = new AbortController()\nac.abort()\nconst { data, error } = await supabase\n  .from('very_big_table')\n  .select()\n  .abortSignal(ac.signal)\n```\n",
          "data": {
            "sql":
              "```ts\nconst ac = new AbortController()\nac.abort()\nconst { data, error } = await supabase\n  .from('very_big_table')\n  .select()\n  .abortSignal(ac.signal)\n```\n",
          },
          "response":
            '```json\n  {\n    "error": {\n      "message": "FetchError: The user aborted a request.",\n      "details": "",\n      "hint": "",\n      "code": ""\n    },\n    "status": 400,\n    "statusText": "Bad Request"\n  }\n  ```\n',
          "description":
            "You can use an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to abort requests.\nNote that `status` and `statusText` don't mean anything for aborted requests as the request wasn't fulfilled.\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "single",
      "title": "single()",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.single",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select('name')\n  .limit(1)\n  .single()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": {\n    "name": "Afghanistan"\n  },\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "maybe-single",
      "title": "maybeSingle()",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.maybeSingle",
      "examples": [
        {
          "id": "with-select",
          "name": "With `select()`",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .eq('name', 'Singapore')\n  .maybeSingle()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "csv",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.csv",
      "title": "csv()",
      "examples": [
        {
          "id": "return-data-as-csv",
          "name": "Return data as CSV",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .csv()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            '```json\n{\n  "data": "id,name\\n1,Afghanistan\\n2,Albania\\n3,Algeria",\n  "status": 200,\n  "statusText": "OK"\n}\n```\n',
          "description":
            "By default, the data is returned in JSON format, but can also be returned as Comma Separated Values.\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "returns",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.returns",
      "title": "returns()",
      "examples": [
        {
          "id": "override-type-of-successful-response",
          "name": "Override type of successful response",
          "code":
            "```ts\nconst { data } = await supabase\n  .from('countries')\n  .select()\n  .returns<MyType>()\n```\n",
          "response": "```\nlet x: typeof data // MyType | null\n```\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
      ],
    },
    {
      "id": "explain",
      "$ref": "@supabase/postgrest-js.PostgrestTransformBuilder.explain",
      "title": "Using Explain",
      "description":
        "For debugging slow queries, you can get the [Postgres `EXPLAIN` execution plan](https://www.postgresql.org/docs/current/sql-explain.html) of a query\nusing the `explain()` method. This works on any query, even for `rpc()` or writes.\n\nExplain is not enabled by default as it can reveal sensitive information about your database.\nIt's best to only enable this for testing environments but if you wish to enable it for production you can provide additional protection by using a `pre-request` function.\n\nFollow the [Performance Debugging Guide](/docs/guides/database/debugging-performance) to enable the functionality on your project.\n",
      "examples": [
        {
          "id": "get-execution-plan",
          "name": "Get the execution plan",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .explain()\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            "```\nAggregate  (cost=33.34..33.36 rows=1 width=112)\n  ->  Limit  (cost=0.00..18.33 rows=1000 width=40)\n        ->  Seq Scan on countries  (cost=0.00..22.00 rows=1200 width=40)\n```\n",
          "description":
            "By default, the data is returned in TEXT format, but can also be returned as JSON by using the `format` parameter.\n",
          "hideCodeBlock": true,
          "isSpotlight": true,
        },
        {
          "id": "get-execution-plan-with-analyze-and-verbose",
          "name": "Get the execution plan with analyze and verbose",
          "code":
            "```ts\nconst { data, error } = await supabase\n  .from('countries')\n  .select()\n  .explain({analyze:true,verbose:true})\n```\n",
          "data": {
            "sql":
              "```sql\ncreate table\n  countries (id int8 primary key, name text);\n\ninsert into\n  countries (id, name)\nvalues\n  (1, 'Afghanistan'),\n  (2, 'Albania'),\n  (3, 'Algeria');\n```\n",
          },
          "response":
            "```\nAggregate  (cost=33.34..33.36 rows=1 width=112) (actual time=0.041..0.041 rows=1 loops=1)\n  Output: NULL::bigint, count(ROW(countries.id, countries.name)), COALESCE(json_agg(ROW(countries.id, countries.name)), '[]'::json), NULLIF(current_setting('response.headers'::text, true), ''::text), NULLIF(current_setting('response.status'::text, true), ''::text)\n  ->  Limit  (cost=0.00..18.33 rows=1000 width=40) (actual time=0.005..0.006 rows=3 loops=1)\n        Output: countries.id, countries.name\n        ->  Seq Scan on public.countries  (cost=0.00..22.00 rows=1200 width=40) (actual time=0.004..0.005 rows=3 loops=1)\n              Output: countries.id, countries.name\nQuery Identifier: -4730654291623321173\nPlanning Time: 0.407 ms\nExecution Time: 0.119 ms\n```\n",
          "description":
            "By default, the data is returned in TEXT format, but can also be returned as JSON by using the `format` parameter.\n",
          "hideCodeBlock": true,
          "isSpotlight": false,
        },
      ],
    },
    {
      "id": "invoke",
      "title": "invoke()",
      "description": "Invoke a Supabase Edge Function.\n",
      "$ref": "@supabase/functions-js.FunctionsClient.invoke",
      "notes":
        "- Requires an Authorization header.\n- Invoke params generally match the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) spec.\n- When you pass in a body to your function, we automatically attach the Content-Type header for `Blob`, `ArrayBuffer`, `File`, `FormData` and `String`. If it doesn't match any of these types we assume the payload is `json`, serialize it and attach the `Content-Type` header as `application/json`. You can override this behavior by passing in a `Content-Type` header of your own.\n- Responses are automatically parsed as `json`, `blob` and `form-data` depending on the `Content-Type` header sent by your function. Responses are parsed as `text` by default.\n",
      "examples": [
        {
          "id": "basic-invocation",
          "name": "Basic invocation",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.functions.invoke('hello', {\n  body: { foo: 'bar' }\n})\n```\n",
        },
        {
          "id": "error-handling",
          "name": "Error handling",
          "description":
            "A `FunctionsHttpError` error is returned if your function throws an error, `FunctionsRelayError` if the Supabase Relay has an error processing your function and `FunctionsFetchError` if there is a network error in calling your function.\n",
          "isSpotlight": true,
          "code":
            "```js\nimport { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from \"@supabase/supabase-js\";\n\nconst { data, error } = await supabase.functions.invoke('hello', {\n  headers: {\n    \"my-custom-header\": 'my-custom-header-value'\n  },\n  body: { foo: 'bar' }\n})\n\nif (error instanceof FunctionsHttpError) {\n  const errorMessage = await error.context.json()\n  console.log('Function returned an error', errorMessage)\n} else if (error instanceof FunctionsRelayError) {\n  console.log('Relay error:', error.message)\n} else if (error instanceof FunctionsFetchError) {\n  console.log('Fetch error:', error.message)\n}\n```\n",
        },
        {
          "id": "passing-custom-headers",
          "name": "Passing custom headers",
          "description":
            "You can pass custom headers to your function. Note: supabase-js automatically passes the `Authorization` header with the signed in user's JWT.\n",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.functions.invoke('hello', {\n  headers: {\n    \"my-custom-header\": 'my-custom-header-value'\n  },\n  body: { foo: 'bar' }\n})\n```\n",
        },
        {
          "id": "calling-with-delete-verb",
          "name": "Calling with DELETE HTTP verb",
          "description":
            "You can also set the HTTP verb to `DELETE` when calling your Edge Function.\n",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.functions.invoke('hello', {\n  headers: {\n    \"my-custom-header\": 'my-custom-header-value'\n  },\n  body: { foo: 'bar' },\n  method: 'DELETE'\n})\n```\n",
        },
        {
          "id": "regional-invocation",
          "name": "Invoking a Function in the UsEast1 region",
          "description":
            "Here are the available regions:\n- `FunctionRegion.Any`\n- `FunctionRegion.ApNortheast1`\n- `FunctionRegion.ApNortheast2`\n- `FunctionRegion.ApSouth1`\n- `FunctionRegion.ApSoutheast1`\n- `FunctionRegion.ApSoutheast2`\n- `FunctionRegion.CaCentral1`\n- `FunctionRegion.EuCentral1`\n- `FunctionRegion.EuWest1`\n- `FunctionRegion.EuWest2`\n- `FunctionRegion.EuWest3`\n- `FunctionRegion.SaEast1`\n- `FunctionRegion.UsEast1`\n- `FunctionRegion.UsWest1`\n- `FunctionRegion.UsWest2`\n",
          "isSpotlight": true,
          "code":
            "```js\nimport { createClient, FunctionRegion } from '@supabase/supabase-js'\n\nconst { data, error } = await supabase.functions.invoke('hello', {\n  body: { foo: 'bar' },\n  region: FunctionRegion.UsEast1\n})\n```\n",
        },
        {
          "id": "calling-with-get-verb",
          "name": "Calling with GET HTTP verb",
          "description":
            "You can also set the HTTP verb to `GET` when calling your Edge Function.\n",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase.functions.invoke('hello', {\n  headers: {\n    \"my-custom-header\": 'my-custom-header-value'\n  },\n  method: 'GET'\n})\n```\n",
        },
      ],
    },
    {
      "id": "subscribe",
      "title": "on().subscribe()",
      "$ref": "@supabase/realtime-js.RealtimeChannel.on",
      "notes":
        "- By default, Broadcast and Presence are enabled for all projects.\n- By default, listening to database changes is disabled for new projects due to database performance and security concerns. You can turn it on by managing Realtime's [replication](/docs/guides/api#realtime-api-overview).\n- You can receive the \"previous\" data for updates and deletes by setting the table's `REPLICA IDENTITY` to `FULL` (e.g., `ALTER TABLE your_table REPLICA IDENTITY FULL;`).\n- Row level security is not applied to delete statements. When RLS is enabled and replica identity is set to full, only the primary key is sent to clients.\n",
      "examples": [
        {
          "id": "listen-to-broadcast",
          "name": "Listen to broadcast messages",
          "isSpotlight": true,
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .on('broadcast', { event: 'cursor-pos' }, payload => {\n    console.log('Cursor position received!', payload)\n  })\n  .subscribe((status) => {\n    if (status === 'SUBSCRIBED') {\n      channel.send({\n        type: 'broadcast',\n        event: 'cursor-pos',\n        payload: { x: Math.random(), y: Math.random() },\n      })\n    }\n  })\n```\n",
        },
        {
          "id": "listen-to-presence-sync",
          "name": "Listen to presence sync",
          "isSpotlight": true,
          "code":
            "```js\nconst channel = supabase.channel('room1')\nchannel\n  .on('presence', { event: 'sync' }, () => {\n    console.log('Synced presence state: ', channel.presenceState())\n  })\n  .subscribe(async (status) => {\n    if (status === 'SUBSCRIBED') {\n      await channel.track({ online_at: new Date().toISOString() })\n    }\n  })\n```\n",
        },
        {
          "id": "listen-to-presence-join",
          "name": "Listen to presence join",
          "isSpotlight": true,
          "code":
            "```js\nconst channel = supabase.channel('room1')\nchannel\n  .on('presence', { event: 'join' }, ({ newPresences }) => {\n    console.log('Newly joined presences: ', newPresences)\n  })\n  .subscribe(async (status) => {\n    if (status === 'SUBSCRIBED') {\n      await channel.track({ online_at: new Date().toISOString() })\n    }\n  })\n```\n",
        },
        {
          "id": "listen-to-presence-leave",
          "name": "Listen to presence leave",
          "isSpotlight": true,
          "code":
            "```js\nconst channel = supabase.channel('room1')\nchannel\n  .on('presence', { event: 'leave' }, ({ leftPresences }) => {\n    console.log('Newly left presences: ', leftPresences)\n  })\n  .subscribe(async (status) => {\n    if (status === 'SUBSCRIBED') {\n      await channel.track({ online_at: new Date().toISOString() })\n      await channel.untrack()\n    }\n  })\n```\n",
        },
        {
          "id": "listen-to-all-database-changes",
          "name": "Listen to all database changes",
          "isSpotlight": true,
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .on('postgres_changes', { event: '*', schema: '*' }, payload => {\n    console.log('Change received!', payload)\n  })\n  .subscribe()\n```\n",
        },
        {
          "id": "listen-to-a-specific-table",
          "name": "Listen to a specific table",
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .on('postgres_changes', { event: '*', schema: 'public', table: 'countries' }, payload => {\n    console.log('Change received!', payload)\n  })\n  .subscribe()\n```\n",
        },
        {
          "id": "listen-to-inserts",
          "name": "Listen to inserts",
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, payload => {\n    console.log('Change received!', payload)\n  })\n  .subscribe()\n```\n",
        },
        {
          "id": "listen-to-updates",
          "name": "Listen to updates",
          "description":
            'By default, Supabase will send only the updated record. If you want to receive the previous values as well you can\nenable full replication for the table you are listening to:\n\n```sql\nalter table "your_table" replica identity full;\n```\n',
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries' }, payload => {\n    console.log('Change received!', payload)\n  })\n  .subscribe()\n```\n",
        },
        {
          "id": "listen-to-deletes",
          "name": "Listen to deletes",
          "description":
            'By default, Supabase does not send deleted records. If you want to receive the deleted record you can\nenable full replication for the table you are listening too:\n\n```sql\nalter table "your_table" replica identity full;\n```\n',
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, payload => {\n    console.log('Change received!', payload)\n  })\n  .subscribe()\n```\n",
        },
        {
          "id": "listen-to-multiple-events",
          "name": "Listen to multiple events",
          "description":
            "You can chain listeners if you want to listen to multiple events for each table.",
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, handleRecordInserted)\n  .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, handleRecordDeleted)\n  .subscribe()\n```\n",
        },
        {
          "id": "listening-to-row-level-changes",
          "name": "Listen to row level changes",
          "description":
            "You can listen to individual rows using the format `{table}:{col}=eq.{val}` - where `{col}` is the column name, and `{val}` is the value which you want to match.",
          "notes":
            "- ``eq`` filter works with all database types as under the hood, it's casting both the filter value and the database value to the correct type and then comparing them.\n",
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'countries', filter: 'id=eq.200' }, handleRecordUpdated)\n  .subscribe()\n```\n",
        },
      ],
    },
    {
      "id": "broadcast-message",
      "title": "broadcastMessage()",
      "description":
        "Broadcast a message to all connected clients to a channel.\n",
      "notes":
        "- When using REST you don't need to subscribe to the channel\n- REST calls are only available from 2.37.0 onwards\n",
      "$ref": "@supabase/realtime-js.RealtimeChannel.send",
      "examples": [
        {
          "id": "send-a-message",
          "name": "Send a message via websocket",
          "isSpotlight": true,
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .subscribe((status) => {\n    if (status === 'SUBSCRIBED') {\n      channel.send({\n        type: 'broadcast',\n        event: 'cursor-pos',\n        payload: { x: Math.random(), y: Math.random() },\n      })\n    }\n  })\n```\n",
        },
        {
          "id": "send-a-message-via-rest",
          "name": "Send a message via REST",
          "isSpotlight": true,
          "code":
            "```js\nsupabase\n  .channel('room1')\n  .send({\n    type: 'broadcast',\n    event: 'cursor-pos',\n    payload: { x: Math.random(), y: Math.random()\n    },\n  })\n```\n",
        },
      ],
    },
    {
      "id": "get-channels",
      "title": "getChannels()",
      "$ref": "@supabase/supabase-js.index.SupabaseClient.getChannels",
      "examples": [
        {
          "id": "get-all-channels",
          "name": "Get all channels",
          "isSpotlight": true,
          "code": "```js\nconst channels = supabase.getChannels()\n```\n",
        },
      ],
    },
    {
      "id": "remove-channel",
      "title": "removeChannel()",
      "$ref": "@supabase/supabase-js.index.SupabaseClient.removeChannel",
      "notes":
        "- Removing a channel is a great way to maintain the performance of your project's Realtime service as well as your database if you're listening to Postgres changes. Supabase will automatically handle cleanup 30 seconds after a client is disconnected, but unused channels may cause degradation as more clients are simultaneously subscribed.\n",
      "examples": [
        {
          "id": "removes-a-channel",
          "name": "Removes a channel",
          "isSpotlight": true,
          "code": "```js\nsupabase.removeChannel(myChannel)\n```\n",
        },
      ],
    },
    {
      "id": "remove-all-channels",
      "title": "removeAllChannels()",
      "$ref": "@supabase/supabase-js.index.SupabaseClient.removeAllChannels",
      "notes":
        "- Removing channels is a great way to maintain the performance of your project's Realtime service as well as your database if you're listening to Postgres changes. Supabase will automatically handle cleanup 30 seconds after a client is disconnected, but unused channels may cause degradation as more clients are simultaneously subscribed.\n",
      "examples": [
        {
          "id": "remove-all-channels",
          "name": "Remove all channels",
          "isSpotlight": true,
          "code": "```js\nsupabase.removeAllChannels()\n```\n",
        },
      ],
    },
    {
      "id": "list-buckets",
      "title": "listBuckets()",
      "$ref":
        "@supabase/storage-js.packages/StorageBucketApi.default.listBuckets",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: `select`\n  - `objects` table permissions: none\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "list-buckets",
          "name": "List buckets",
          "isSpotlight": true,
          "code":
            "```ts\nconst { data, error } = await supabase\n  .storage\n  .listBuckets()\n```\n",
        },
      ],
    },
    {
      "id": "get-bucket",
      "title": "getBucket()",
      "$ref":
        "@supabase/storage-js.packages/StorageBucketApi.default.getBucket",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: `select`\n  - `objects` table permissions: none\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "get-bucket",
          "name": "Get bucket",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .getBucket('avatars')\n```\n",
        },
      ],
    },
    {
      "id": "create-bucket",
      "title": "createBucket()",
      "$ref":
        "@supabase/storage-js.packages/StorageBucketApi.default.createBucket",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: `insert`\n  - `objects` table permissions: none\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "create-bucket",
          "name": "Create bucket",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .createBucket('avatars', {\n    public: false,\n    allowedMimeTypes: ['image/png'],\n    fileSizeLimit: 1024\n  })\n```\n",
        },
      ],
    },
    {
      "id": "empty-bucket",
      "title": "emptyBucket()",
      "$ref":
        "@supabase/storage-js.packages/StorageBucketApi.default.emptyBucket",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: `select`\n  - `objects` table permissions: `select` and `delete`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "empty-bucket",
          "name": "Empty bucket",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .emptyBucket('avatars')\n```\n",
        },
      ],
    },
    {
      "id": "update-bucket",
      "title": "updateBucket()",
      "$ref":
        "@supabase/storage-js.packages/StorageBucketApi.default.updateBucket",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: `select` and `update`\n  - `objects` table permissions: none\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "update-bucket",
          "name": "Update bucket",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .updateBucket('avatars', {\n    public: false,\n    allowedMimeTypes: ['image/png'],\n    fileSizeLimit: 1024\n  })\n```\n",
        },
      ],
    },
    {
      "id": "delete-bucket",
      "title": "deleteBucket()",
      "$ref":
        "@supabase/storage-js.packages/StorageBucketApi.default.deleteBucket",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: `select` and `delete`\n  - `objects` table permissions: none\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "delete-bucket",
          "name": "Delete bucket",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .deleteBucket('avatars')\n```\n",
        },
      ],
    },
    {
      "id": "from-upload",
      "title": "from.upload()",
      "$ref": "@supabase/storage-js.packages/StorageFileApi.default.upload",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: only `insert` when you are uploading new files and `select`, `insert` and `update` when you are upserting files\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n- For React Native, using either `Blob`, `File` or `FormData` does not work as intended. Upload file using `ArrayBuffer` from base64 file data instead, see example below.\n",
      "examples": [
        {
          "id": "upload-file",
          "name": "Upload file",
          "isSpotlight": true,
          "code":
            "```js\nconst avatarFile = event.target.files[0]\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .upload('public/avatar1.png', avatarFile, {\n    cacheControl: '3600',\n    upsert: false\n  })\n```\n",
        },
        {
          "id": "upload-file-using-arraybuffer-from-base64-file-data",
          "name": "Upload file using `ArrayBuffer` from base64 file data",
          "code":
            "```js\nimport { decode } from 'base64-arraybuffer'\n\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .upload('public/avatar1.png', decode('base64FileData'), {\n    contentType: 'image/png'\n  })\n```\n",
        },
      ],
    },
    {
      "id": "from-update",
      "title": "from.update()",
      "$ref": "@supabase/storage-js.packages/StorageFileApi.default.update",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: `update` and `select`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n- For React Native, using either `Blob`, `File` or `FormData` does not work as intended. Update file using `ArrayBuffer` from base64 file data instead, see example below.\n",
      "examples": [
        {
          "id": "update-file",
          "name": "Update file",
          "isSpotlight": true,
          "code":
            "```js\nconst avatarFile = event.target.files[0]\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .update('public/avatar1.png', avatarFile, {\n    cacheControl: '3600',\n    upsert: true\n  })\n```\n",
        },
        {
          "id": "update-file-using-arraybuffer-from-base64-file-data",
          "name": "Update file using `ArrayBuffer` from base64 file data",
          "code":
            "```js\nimport {decode} from 'base64-arraybuffer'\n\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .update('public/avatar1.png', decode('base64FileData'), {\n    contentType: 'image/png'\n  })\n```\n",
        },
      ],
    },
    {
      "id": "from-move",
      "title": "from.move()",
      "$ref": "@supabase/storage-js.packages/StorageFileApi.default.move",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: `update` and `select`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "move-file",
          "name": "Move file",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .move('public/avatar1.png', 'private/avatar2.png')\n```\n",
        },
      ],
    },
    {
      "id": "from-copy",
      "title": "from.copy()",
      "$ref": "@supabase/storage-js.packages/StorageFileApi.default.copy",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: `insert` and `select`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "copy-file",
          "name": "Copy file",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .copy('public/avatar1.png', 'private/avatar2.png')\n```\n",
        },
      ],
    },
    {
      "id": "from-create-signed-url",
      "title": "from.createSignedUrl()",
      "$ref":
        "@supabase/storage-js.packages/StorageFileApi.default.createSignedUrl",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: `select`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "create-signed-url",
          "name": "Create Signed URL",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .createSignedUrl('folder/avatar1.png', 60)\n```\n",
        },
        {
          "id": "create-signed-url-with-transformations",
          "name": "Create a signed URL for an asset with transformations",
          "isSpotlight": true,
          "code":
            "```js\nconst { data } = await supabase\n  .storage\n  .from('avatars')\n  .createSignedUrl('folder/avatar1.png', 60, {\n    transform: {\n      width: 100,\n      height: 100,\n    }\n  })\n```\n",
        },
        {
          "id": "create-signed-url-with-download",
          "name":
            "Create a signed URL which triggers the download of the asset",
          "isSpotlight": true,
          "code":
            "```js\nconst { data } = await supabase\n  .storage\n  .from('avatars')\n  .createSignedUrl('folder/avatar1.png', 60, {\n    download: true,\n  })\n```\n",
        },
      ],
    },
    {
      "id": "from-create-signed-urls",
      "title": "from.createSignedUrls()",
      "$ref":
        "@supabase/storage-js.packages/StorageFileApi.default.createSignedUrls",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: `select`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "create-signed-urls",
          "name": "Create Signed URLs",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .createSignedUrls(['folder/avatar1.png', 'folder/avatar2.png'], 60)\n```\n",
        },
      ],
    },
    {
      "id": "from-create-signed-upload-url",
      "title": "from.createSignedUploadUrl()",
      "$ref":
        "@supabase/storage-js.packages/StorageFileApi.default.createSignedUploadUrl",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: `insert`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "create-signed-upload-url",
          "name": "Create Signed Upload URL",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .createSignedUploadUrl('folder/cat.jpg')\n```\n",
        },
      ],
    },
    {
      "id": "from-upload-to-signed-url",
      "title": "from.uploadToSignedUrl()",
      "$ref":
        "@supabase/storage-js.packages/StorageFileApi.default.uploadToSignedUrl",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: none\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "upload-to-signed-url",
          "name": "Upload to a signed URL",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .uploadToSignedUrl('folder/cat.jpg', 'token-from-createSignedUploadUrl', file)\n```\n",
        },
      ],
    },
    {
      "id": "from-get-public-url",
      "title": "from.getPublicUrl()",
      "$ref":
        "@supabase/storage-js.packages/StorageFileApi.default.getPublicUrl",
      "notes":
        '- The bucket needs to be set to public, either via [updateBucket()](/docs/reference/javascript/storage-updatebucket) or by going to Storage on [supabase.com/dashboard](https://supabase.com/dashboard), clicking the overflow menu on a bucket and choosing "Make public"\n- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: none\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n',
      "examples": [
        {
          "id": "returns-the-url-for-an-asset-in-a-public-bucket",
          "name": "Returns the URL for an asset in a public bucket",
          "isSpotlight": true,
          "code":
            "```js\nconst { data } = supabase\n  .storage\n  .from('public-bucket')\n  .getPublicUrl('folder/avatar1.png')\n```\n",
        },
        {
          "id": "transform-asset-in-public-bucket",
          "name":
            "Returns the URL for an asset in a public bucket with transformations",
          "isSpotlight": true,
          "code":
            "```js\nconst { data } = supabase\n  .storage\n  .from('public-bucket')\n  .getPublicUrl('folder/avatar1.png', {\n    transform: {\n      width: 100,\n      height: 100,\n    }\n  })\n```\n",
        },
        {
          "id": "download-asset-in-public-bucket",
          "name":
            "Returns the URL which triggers the download of an asset in a public bucket",
          "isSpotlight": true,
          "code":
            "```js\nconst { data } = supabase\n  .storage\n  .from('public-bucket')\n  .getPublicUrl('folder/avatar1.png', {\n    download: true,\n  })\n```\n",
        },
      ],
    },
    {
      "id": "from-download",
      "title": "from.download()",
      "$ref": "@supabase/storage-js.packages/StorageFileApi.default.download",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: `select`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "download-file",
          "name": "Download file",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .download('folder/avatar1.png')\n```\n",
        },
        {
          "id": "download-file-with-transformations",
          "name": "Download file with transformations",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .download('folder/avatar1.png', {\n    transform: {\n      width: 100,\n      height: 100,\n      quality: 80\n    }\n  })\n```\n",
        },
      ],
    },
    {
      "id": "from-remove",
      "title": "from.remove()",
      "$ref": "@supabase/storage-js.packages/StorageFileApi.default.remove",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: `delete` and `select`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "delete-file",
          "name": "Delete file",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .remove(['folder/avatar1.png'])\n```\n",
        },
      ],
    },
    {
      "id": "from-list",
      "title": "from.list()",
      "$ref": "@supabase/storage-js.packages/StorageFileApi.default.list",
      "notes":
        "- RLS policy permissions required:\n  - `buckets` table permissions: none\n  - `objects` table permissions: `select`\n- Refer to the [Storage guide](/docs/guides/storage/security/access-control) on how access control works\n",
      "examples": [
        {
          "id": "list-files-in-a-bucket",
          "name": "List files in a bucket",
          "isSpotlight": true,
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .list('folder', {\n    limit: 100,\n    offset: 0,\n    sortBy: { column: 'name', order: 'asc' },\n  })\n```\n",
        },
        {
          "id": "search-files-in-a-bucket",
          "name": "Search files in a bucket",
          "code":
            "```js\nconst { data, error } = await supabase\n  .storage\n  .from('avatars')\n  .list('folder', {\n    limit: 100,\n    offset: 0,\n    sortBy: { column: 'name', order: 'asc' },\n    search: 'jon'\n  })\n```\n",
        },
      ],
    },
  ],
};
