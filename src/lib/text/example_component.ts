const component = `
<script>
    import { createClient } from '@supabase/supabase-js'
    
    const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

    let password = ""
    let email = ""
    
    async function signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://example.com/welcome'
        }
      })
    
      if (error) {
        console.error('Error signing in with Google:', error.message)
      } else {
        console.log('Signed in with Google')
      }
    }
    
    async function signInWithApple() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'https://example.com/welcome'
        }
      })
    
      if (error) {
        console.error('Error signing in with Apple:', error.message)
      } else {
        console.log('Signed in with Apple:')
      }
    }
    
    async function signInWithEmail() {
    
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
    
      if (error) {
        console.error('Error signing in with email:', error.message)
      } else {
        console.log('Signed in with email:', data.user)
      }
    }
    </script>
    
    <div class="rounded-lg bg-gray-900 p-8 shadow-lg">
      <h1 class="mb-6 text-3xl font-bold text-white">Login</h1>
      <form>
        <div class="mb-4">
          <label class="mb-2 block text-gray-400" for="email">Email</label>
          <input class="w-full rounded-md bg-gray-800 px-3 py-2 text-white" type="email" id="email" placeholder="Enter your email" required bind:value={email}/>
        </div>
        <div class="mb-6">
          <label class="mb-2 block text-gray-400" for="password">Password</label>
          <input class="w-full rounded-md bg-gray-800 px-3 py-2 text-white" type="password" id="password" placeholder="Enter your password" required bind:value={password}/>
        </div>
        <div class="flex items-center justify-between">
          <button on:click|preventDefault={signInWithGoogle} class="mb-4 mr-2 flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28" height="28">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            <span class="ml-2">Log in with Google</span>
          </button>
          <button on:click|preventDefault={signInWithApple} class="mb-4 ml-2 flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2 pr-6 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-apple" viewBox="0 0 16 16">
              <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
            </svg>
            <span class="ml-6">
              Log in with<br />
              Apple
            </span>
          </button>
        </div>
        <button on:click|preventDefault={signInWithEmail} class="w-full rounded-md bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700">Log In</button>
      </form>
    </div>
    `;

export default component;
